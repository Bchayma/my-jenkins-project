<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use App\Security\AppAuthenticator;
use App\Security\EmailVerifier;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mime\Address;
use Symfony\Component\Routing\Attribute\Route;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Http\Authentication\UserAuthenticatorInterface;
use App\Security\FormLoginAuthenticator;




class RegistrationController extends AbstractController
{
    public function __construct(private EmailVerifier $emailVerifier) {}

    #[Route('/register', name: 'app_register')]
    public function register(
        Request $request,
        UserPasswordHasherInterface $userPasswordHasher,
        EntityManagerInterface $entityManager
    ): Response {
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Hash and set the password
            $plainPassword = $form->get('plainPassword')->getData();
            $user->setPassword($userPasswordHasher->hashPassword($user, $plainPassword));

            // Set the default role to ROLE_USER
            $user->setRole('ROLE_USER');

            // Set the creation date
            $user->setCreatedAt(new \DateTimeImmutable());

            // Persist the user to the database
            $entityManager->persist($user);
            $entityManager->flush();

            // Send email confirmation
            $this->emailVerifier->sendEmailConfirmation(
                'app_verify_email',
                $user,
                (new TemplatedEmail())
                    ->from(new Address('mailer@mailer.de', 'mailer boot'))
                    ->to($user->getEmail())
                    ->subject('Please Confirm your Email')
                    ->htmlTemplate('registration/confirmation_email.html.twig')
            );

            $this->addFlash('success', 'Please check your email to verify your account.');

            // Redirect to email verification page
            return $this->redirectToRoute('app_verify_email', ['email' => $user->getEmail()]);
        }

        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form->createView(),
        ]);
    }


    #[Route('/verify/email', name: 'app_verify_email')]
    public function verifyUserEmail(
        Request $request,
        EntityManagerInterface $entityManager,
        UserAuthenticatorInterface $userAuthenticator,
        FormLoginAuthenticator $formLoginAuthenticator
    ): Response {
        $email = $request->get('email'); // Récupérez l'email depuis l'URL
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$user) {
            $this->addFlash('verify_email_error', 'User not found.');
            return $this->redirectToRoute('app_register');
        }

        try {
            // Vérification de l'email
            $this->emailVerifier->handleEmailConfirmation($request, $user);

            // Authentification automatique
            return $userAuthenticator->authenticateUser(
                $user,
                $formLoginAuthenticator,
                $request
            );
        } catch (VerifyEmailExceptionInterface $exception) {
            $this->addFlash('verify_email_error', $exception->getReason());
            return $this->redirectToRoute('app_register');
        }
    }
}

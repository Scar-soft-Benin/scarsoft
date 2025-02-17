import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.models import Group, Permission
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, full_name, username, email, password=None, role=None):
        if not email:
            raise ValueError('Users must have an email address')
        if not username:
            raise ValueError('Users must have a username')
        if not full_name:
            raise ValueError('Users must have a full name')

        email = self.normalize_email(email).lower()
        user = self.model(
            email=email,
            username=username,
            full_name=full_name,
            role=role
        )

        user.set_password(password)
        user.save(using=self._db)

        # Attribution du groupe selon le rôle
        if role == User.MANAGER:
            group, created = Group.objects.get_or_create(name='Manager')
            user.groups.add(group)

        return user
    
    def create_superuser(self, full_name, username, email, password=None):
        user = self.create_user(
            full_name=full_name,
            username=username,
            email=email,
            password=password,
            role=User.ADMIN,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.role = User.ADMIN
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    ADMIN = 1
    MANAGER = 2
    
    ROLE_CHOICES = (
        (ADMIN, 'Admin'),
        (MANAGER, 'Manager'),
    )
    
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    full_name = models.CharField(max_length=255)
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(max_length=150, unique=True)
    role = models.PositiveSmallIntegerField(choices=ROLE_CHOICES, default=MANAGER)
    otp = models.CharField(max_length=100, blank=True, null=True)
    refresh_token = models.CharField(max_length=1000, null=True, blank=True)

    # Required Fields
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(default=timezone.now)
    modified = models.DateTimeField(default=timezone.now)
    
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_superadmin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'full_name']

    objects = UserManager()

    def __str__(self):
        return self.email
    
    class Meta:
        permissions = [
            ("Can_Add_Rrecruitment", "Ajouter un recrutement")
        ]
    
    # def has_perm(self, perm, obj=None):
    #     return self.is_admin
    
    # def has_module_perms(self, app_label):
    #     return True

    def get_role(self):
        return dict(self.ROLE_CHOICES).get(self.role, "Unknown") # pour récupérer le nom du rôle proprement

    def save(self, *args, **kwargs):
        if self.email and '@' in self.email:
            email_username, _ = self.email.split('@', 1) # Décompose seulement la partie avant '@'
            if not self.full_name:
                self.full_name = email_username
            if not self.username:
                self.username = email_username
        super(User, self).save(*args, **kwargs)


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=255)
    profile_picture = models.ImageField(upload_to='users/profile/', blank=True, null=True)
    poste = models.CharField(max_length=15)
    about = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    
    def __str__(self):
        return self.full_name or self.user.full_name
    
    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.full_name:
            self.full_name = self.user.username
        super(UserProfile, self).save(*args, **kwargs)

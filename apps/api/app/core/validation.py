"""Input validation utilities"""

import re
from typing import List


def validate_password(password: str) -> tuple[bool, List[str]]:
    """
    Validate password strength

    Args:
        password: Password to validate

    Returns:
        Tuple of (is_valid, list_of_errors)
    """
    errors: List[str] = []

    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")

    # Argon2 supports passwords up to 2^32-1 bytes, but we set a reasonable limit
    # to prevent abuse (e.g., extremely long passwords causing DoS)
    # 1024 characters is a generous limit that allows for passphrases
    if len(password) > 1024:
        errors.append("Password must be no more than 1024 characters long")

    if not re.search(r"[a-z]", password):
        errors.append("Password must contain at least one lowercase letter")

    if not re.search(r"[A-Z]", password):
        errors.append("Password must contain at least one uppercase letter")

    if not re.search(r"\d", password):
        errors.append("Password must contain at least one number")

    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("Password must contain at least one special character")

    return (len(errors) == 0, errors)


def validate_email(email: str) -> bool:
    """
    Validate email format (basic check)

    Args:
        email: Email to validate

    Returns:
        True if email format is valid
    """
    if not email or "@" not in email:
        return False

    # Basic email regex
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))

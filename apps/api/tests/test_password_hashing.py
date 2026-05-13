"""Password hashing behavior tests."""

from app.services.user_service import hash_password, verify_password


def test_hash_password_uses_argon2id():
    password_hash = hash_password("s3cret-password")
    assert password_hash.startswith("$argon2id$")


def test_verify_password_accepts_valid_password():
    password_hash = hash_password("s3cret-password")
    assert verify_password("s3cret-password", password_hash) is True


def test_verify_password_rejects_invalid_password():
    password_hash = hash_password("s3cret-password")
    assert verify_password("wrong-password", password_hash) is False


def test_verify_password_handles_invalid_hash_value():
    assert verify_password("s3cret-password", "not-a-valid-hash") is False

"""Custom exceptions for GraphQL and API"""


class AuthenticationError(Exception):
    """Raised when authentication fails"""

    def __init__(self, message: str = "Authentication failed"):
        self.message = message
        super().__init__(self.message)


class AuthorizationError(Exception):
    """Raised when authorization fails"""

    def __init__(self, message: str = "Not authorized"):
        self.message = message
        super().__init__(self.message)


class ValidationError(Exception):
    """Raised when validation fails"""

    def __init__(self, message: str = "Validation failed"):
        self.message = message
        super().__init__(self.message)

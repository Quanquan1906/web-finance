class AuthInterface:
    @abstractmethod
    def get_user_by_id(self, user_id: str) -> str:
        pass
    
    
"""
Password Generator Module.

Provides cryptographically secure password generation with custom character set selection,
guaranteed category coverage, ambiguous character exclusion, and strength evaluation.
"""

import math
import secrets
import string
import subprocess
import sys
from typing import Dict, List, Tuple, Union

# Define character sets using standard library's string module
UPPERCASE_CHARS = string.ascii_uppercase
LOWERCASE_CHARS = string.ascii_lowercase
DIGIT_CHARS = string.digits
SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?"

# Set of visually ambiguous characters that can easily be misread (e.g., in printed text)
AMBIGUOUS_CHARS = "O0Il1|o5S2ZB"


class PasswordGenerator:
    """
    Cryptographically secure password generator.

    Uses Python's `secrets` module, which accesses the operating system's
    cryptographically secure random number generator (CSPRNG) via os.urandom().
    """

    def __init__(
        self,
        length: int = 16,
        use_uppercase: bool = True,
        use_lowercase: bool = True,
        use_digits: bool = True,
        use_special: bool = True,
        exclude_ambiguous: bool = False,
    ):
        """
        Initialize the PasswordGenerator.

        :param length: Desired length of the password.
        :param use_uppercase: Include uppercase letters (A-Z).
        :param use_lowercase: Include lowercase letters (a-z).
        :param use_digits: Include numbers (0-9).
        :param use_special: Include special characters.
        :param exclude_ambiguous: Exclude ambiguous characters (e.g. O, 0, I, l, 1).
        """
        self.length = length
        self.use_uppercase = use_uppercase
        self.use_lowercase = use_lowercase
        self.use_digits = use_digits
        self.use_special = use_special
        self.exclude_ambiguous = exclude_ambiguous

    def _filter_ambiguous(self, char_set: str) -> str:
        """
        Remove ambiguous characters from a given character set if requested.
        """
        if not self.exclude_ambiguous:
            return char_set
        return "".join(c for c in char_set if c not in AMBIGUOUS_CHARS)

    def get_categories(self) -> List[Tuple[str, str]]:
        """
        Build list of enabled character categories with their allowed characters.

        :return: List of tuples (category_name, character_string)
        """
        categories = []
        if self.use_uppercase:
            chars = self._filter_ambiguous(UPPERCASE_CHARS)
            if chars:
                categories.append(("uppercase", chars))
        if self.use_lowercase:
            chars = self._filter_ambiguous(LOWERCASE_CHARS)
            if chars:
                categories.append(("lowercase", chars))
        if self.use_digits:
            chars = self._filter_ambiguous(DIGIT_CHARS)
            if chars:
                categories.append(("digits", chars))
        if self.use_special:
            chars = self._filter_ambiguous(SPECIAL_CHARS)
            if chars:
                categories.append(("special", chars))
        return categories

    def get_pool_size(self) -> int:
        """
        Calculate total character pool size based on selected categories.
        """
        categories = self.get_categories()
        return sum(len(chars) for _, chars in categories)

    def validate_options(self) -> None:
        """
        Validate generator configuration before generation.

        :raises ValueError: If configuration is invalid.
        """
        categories = self.get_categories()
        if not categories:
            raise ValueError(
                "At least one character category (uppercase, lowercase, numbers, or special) must be enabled."
            )

        min_required_length = len(categories)
        if self.length < min_required_length:
            raise ValueError(
                f"Password length ({self.length}) must be at least equal to the number of selected categories ({min_required_length}) "
                "to guarantee inclusion of all selected character types."
            )

    def generate(self) -> str:
        """
        Generate a cryptographically secure random password matching the configured criteria.

        Guarantee: Includes at least one character from each selected category.

        :return: Generated password string.
        """
        self.validate_options()

        categories = self.get_categories()
        password_chars = []

        # Security Guarantee: Pick at least one character from every enabled category
        # using secrets.choice for cryptographically secure selection.
        for _, chars in categories:
            password_chars.append(secrets.choice(chars))

        # Build combined pool of all enabled character sets for remaining characters
        combined_pool = "".join(chars for _, chars in categories)

        # Fill remaining password length with choices from the combined pool
        remaining_length = self.length - len(password_chars)
        for _ in range(remaining_length):
            password_chars.append(secrets.choice(combined_pool))

        # Security: Securely shuffle the password characters in-place using secrets.SystemRandom()
        # so that category-guaranteed characters are not predictably located at the start.
        secrets.SystemRandom().shuffle(password_chars)

        return "".join(password_chars)

    def generate_multiple(self, count: int) -> List[str]:
        """
        Generate multiple passwords with the current settings.

        :param count: Number of passwords to generate.
        :return: List of password strings.
        """
        if count < 1:
            raise ValueError("Count must be at least 1.")
        return [self.generate() for _ in range(count)]

    def evaluate_strength(self, password: str) -> Dict[str, Union[float, str]]:
        """
        Evaluate the password strength using Shannon entropy (in bits) and character composition.

        Entropy Formula: E = L * log2(R)
        where L = password length, R = character pool size

        :param password: Password string to evaluate.
        :return: Dictionary containing 'entropy_bits' and 'rating' ("Weak", "Medium", "Strong", "Very Strong").
        """
        pool_size = self.get_pool_size()
        if pool_size <= 1 or not password:
            return {"entropy_bits": 0.0, "rating": "Weak"}

        entropy = len(password) * math.log2(pool_size)

        if entropy < 40:
            rating = "Weak"
        elif entropy < 60:
            rating = "Medium"
        elif entropy < 80:
            rating = "Strong"
        else:
            rating = "Very Strong"

        return {"entropy_bits": round(entropy, 2), "rating": rating}


def copy_to_clipboard(text: str) -> bool:
    """
    Copy specified text to system clipboard using standard library tools (Tkinter or OS utilities).

    :param text: Text string to copy to clipboard.
    :return: True if copied successfully, False otherwise.
    """
    # First attempt: Try standard library's Tkinter module
    try:
        import tkinter as tk
        root = tk.Tk()
        root.withdraw()
        root.clipboard_clear()
        root.clipboard_append(text)
        root.update()
        root.destroy()
        return True
    except Exception:
        pass

    # Second attempt: Try standard OS CLI utilities via subprocess
    try:
        if sys.platform.startswith("darwin"):
            p = subprocess.Popen(["pbcopy"], stdin=subprocess.PIPE)
            p.communicate(input=text.encode("utf-8"))
            return p.returncode == 0
        elif sys.platform.startswith("linux"):
            for cmd in [["xclip", "-selection", "clipboard"], ["xsel", "-b", "-i"]]:
                try:
                    p = subprocess.Popen(cmd, stdin=subprocess.PIPE)
                    p.communicate(input=text.encode("utf-8"))
                    if p.returncode == 0:
                        return True
                except FileNotFoundError:
                    continue
        elif sys.platform.startswith("win32"):
            p = subprocess.Popen(["clip"], stdin=subprocess.PIPE, shell=True)
            p.communicate(input=text.encode("utf-8"))
            return p.returncode == 0
    except Exception:
        pass

    return False


def prompt_bool(prompt_text: str, default: bool = True) -> bool:
    """
    Prompt user for a boolean (yes/no) input with a default option.
    """
    suffix = " [Y/n]: " if default else " [y/N]: "
    while True:
        response = input(prompt_text + suffix).strip().lower()
        if not response:
            return default
        if response in ["y", "yes"]:
            return True
        if response in ["n", "no"]:
            return False
        print("Invalid input. Please enter 'y' or 'n'.")


def prompt_int(prompt_text: str, default: int, min_val: int = 1) -> int:
    """
    Prompt user for an integer input with a default option and minimum constraint.
    """
    prompt_str = f"{prompt_text} [{default}]: "
    while True:
        response = input(prompt_str).strip()
        if not response:
            return default
        try:
            val = int(response)
            if val < min_val:
                print(f"Value must be at least {min_val}.")
                continue
            return val
        except ValueError:
            print("Invalid input. Please enter a valid integer.")


def cli_main() -> None:
    """
    Interactive command-line interface for generating passwords.
    """
    print("=" * 60)
    print("      Cryptographically Secure Password Generator")
    print("=" * 60)

    try:
        use_uppercase = prompt_bool("Include Uppercase letters (A-Z)?", default=True)
        use_lowercase = prompt_bool("Include Lowercase letters (a-z)?", default=True)
        use_digits = prompt_bool("Include Numbers (0-9)?", default=True)
        use_special = prompt_bool("Include Special characters (!@#$%...)?", default=True)
        exclude_ambiguous = prompt_bool(
            "Exclude ambiguous characters (e.g. O, 0, I, l, 1)?", default=False
        )

        selected_categories = sum(
            [use_uppercase, use_lowercase, use_digits, use_special]
        )
        if selected_categories == 0:
            print(
                "\nError: At least one character category must be selected! Exiting."
            )
            return

        min_len = max(4, selected_categories)
        length = prompt_int("Enter password length", default=16, min_val=min_len)
        count = prompt_int("How many passwords to generate?", default=1, min_val=1)

        generator = PasswordGenerator(
            length=length,
            use_uppercase=use_uppercase,
            use_lowercase=use_lowercase,
            use_digits=use_digits,
            use_special=use_special,
            exclude_ambiguous=exclude_ambiguous,
        )

        passwords = generator.generate_multiple(count)

        print("\n" + "-" * 60)
        print("Generated Password(s):")
        print("-" * 60)

        for idx, pwd in enumerate(passwords, start=1):
            strength = generator.evaluate_strength(pwd)
            print(
                f"[{idx}] {pwd}  (Strength: {strength['rating']} ~ {strength['entropy_bits']} bits entropy)"
            )

        print("-" * 60)

        if count == 1:
            if prompt_bool("Copy password to clipboard?", default=True):
                if copy_to_clipboard(passwords[0]):
                    print("✓ Password copied to clipboard!")
                else:
                    print("⚠️ Could not copy to clipboard (clipboard tools unavailable).")
        else:
            copy_choice = input(
                f"Enter password number (1-{count}) to copy to clipboard (or press Enter to skip): "
            ).strip()
            if copy_choice.isdigit():
                idx_choice = int(copy_choice)
                if 1 <= idx_choice <= count:
                    if copy_to_clipboard(passwords[idx_choice - 1]):
                        print(
                            f"✓ Password #{idx_choice} copied to clipboard!"
                        )
                    else:
                        print("⚠️ Could not copy to clipboard (clipboard tools unavailable).")

        print("\nSecurity Notice: Generated passwords are never stored or logged.")

    except KeyboardInterrupt:
        print("\nOperation canceled by user.")
    except Exception as e:
        print(f"\nError: {e}")


if __name__ == "__main__":
    cli_main()

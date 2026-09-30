"""
Unit tests for Password Generator Module.
"""

import unittest
from password_generator import (
    PasswordGenerator,
    AMBIGUOUS_CHARS,
    UPPERCASE_CHARS,
    LOWERCASE_CHARS,
    DIGIT_CHARS,
    SPECIAL_CHARS,
)


class TestPasswordGenerator(unittest.TestCase):

    def test_default_generation(self):
        gen = PasswordGenerator(length=16)
        password = gen.generate()
        self.assertEqual(len(password), 16)
        # Check presence of each default category
        self.assertTrue(any(c in UPPERCASE_CHARS for c in password))
        self.assertTrue(any(c in LOWERCASE_CHARS for c in password))
        self.assertTrue(any(c in DIGIT_CHARS for c in password))
        self.assertTrue(any(c in SPECIAL_CHARS for c in password))

    def test_guaranteed_category_inclusion(self):
        # Run multiple iterations to ensure guaranteed inclusion holds consistently
        gen = PasswordGenerator(
            length=10,
            use_uppercase=True,
            use_lowercase=True,
            use_digits=True,
            use_special=True,
        )
        for _ in range(50):
            pwd = gen.generate()
            self.assertTrue(any(c in UPPERCASE_CHARS for c in pwd))
            self.assertTrue(any(c in LOWERCASE_CHARS for c in pwd))
            self.assertTrue(any(c in DIGIT_CHARS for c in pwd))
            self.assertTrue(any(c in SPECIAL_CHARS for c in pwd))

    def test_exclude_ambiguous_characters(self):
        gen = PasswordGenerator(
            length=30,
            use_uppercase=True,
            use_lowercase=True,
            use_digits=True,
            use_special=True,
            exclude_ambiguous=True,
        )
        for _ in range(20):
            pwd = gen.generate()
            for char in AMBIGUOUS_CHARS:
                self.assertNotIn(
                    char, pwd, f"Ambiguous character '{char}' found in password"
                )

    def test_subset_categories(self):
        # Only lowercase and digits enabled
        gen = PasswordGenerator(
            length=12,
            use_uppercase=False,
            use_lowercase=True,
            use_digits=True,
            use_special=False,
        )
        pwd = gen.generate()
        self.assertEqual(len(pwd), 12)
        self.assertTrue(any(c in LOWERCASE_CHARS for c in pwd))
        self.assertTrue(any(c in DIGIT_CHARS for c in pwd))
        self.assertFalse(any(c in UPPERCASE_CHARS for c in pwd))
        self.assertFalse(any(c in SPECIAL_CHARS for c in pwd))

    def test_invalid_length(self):
        # Length 3 is less than the 4 selected categories
        gen = PasswordGenerator(
            length=3,
            use_uppercase=True,
            use_lowercase=True,
            use_digits=True,
            use_special=True,
        )
        with self.assertRaises(ValueError):
            gen.generate()

    def test_no_categories_selected(self):
        gen = PasswordGenerator(
            length=10,
            use_uppercase=False,
            use_lowercase=False,
            use_digits=False,
            use_special=False,
        )
        with self.assertRaises(ValueError):
            gen.generate()

    def test_generate_multiple(self):
        gen = PasswordGenerator(length=12)
        passwords = gen.generate_multiple(5)
        self.assertEqual(len(passwords), 5)
        for pwd in passwords:
            self.assertEqual(len(pwd), 12)

        with self.assertRaises(ValueError):
            gen.generate_multiple(0)

    def test_strength_evaluation(self):
        gen = PasswordGenerator(
            length=8,
            use_uppercase=True,
            use_lowercase=True,
            use_digits=False,
            use_special=False,
        )
        strength = gen.evaluate_strength("aB123456")
        self.assertIn("rating", strength)
        self.assertIn("entropy_bits", strength)
        self.assertIn(
            strength["rating"], ["Weak", "Medium", "Strong", "Very Strong"]
        )

        # Longer password should yield higher entropy rating
        gen_strong = PasswordGenerator(length=24)
        pwd_strong = gen_strong.generate()
        strength_strong = gen_strong.evaluate_strength(pwd_strong)
        self.assertIn(strength_strong["rating"], ["Strong", "Very Strong"])


if __name__ == "__main__":
    unittest.main()

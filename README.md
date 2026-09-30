# Secure Password Generator

A secure, user-friendly, and cryptographically sound password generator written in Python.

## Features

- **Cryptographically Secure**: Uses Python's `secrets` module (CSPRNG) backed by operating system entropy (`os.urandom()`).
- **Flexible Character Sets**: Independent toggle for Uppercase, Lowercase, Numbers, and Special characters.
- **Category Guarantee**: Ensures generated passwords contain at least one character from every selected category.
- **Ambiguous Character Exclusion**: Option to eliminate visually ambiguous characters (such as `O`, `0`, `I`, `l`, `1`, `|`, `5`, `S`, `2`, `Z`, `B`).
- **Password Strength Evaluation**: Measures strength using Shannon entropy in bits and rates passwords as **Weak**, **Medium**, **Strong**, or **Very Strong**.
- **Batch Generation**: Option to generate multiple passwords in a single run.
- **Clipboard Integration**: Easy single-click/prompt copy feature utilizing Python standard library (`tkinter`) or native platform tools (`pbcopy`/`clip`/`xclip`).
- **Zero Persistence / Privacy First**: Never stores, logs, or caches generated passwords.
- **Modular Codebase**: Fully modular class (`PasswordGenerator`) with error validation and clear security comments.

---

## Why `secrets` is Preferable to `random` for Password Generation

Python's standard `random` module uses the **Mersenne Twister** algorithm (MT19937) as its core generator. While Mersenne Twister provides excellent statistical distribution for simulations and games, **it is not cryptographically secure**:

1. **Predictability**: The internal state of Mersenne Twister consists of 624 32-bit integers. By observing 624 consecutive outputs, an attacker can reconstruct the internal state and predict all future outputs with 100% precision.
2. **Deterministic Seed**: `random` is pseudorandom and deterministic when seeded.

In contrast, Python's `secrets` module (introduced in Python 3.6) accesses the OS-level **Cryptographically Secure Pseudo-Random Number Generator (CSPRNG)** (e.g., `/dev/urandom` on Unix/Linux/macOS or `CryptGenRandom` / `BCryptGenRandom` on Windows):

- CSPRNGs draw entropy from hardware interrupts, thermal noise, and kernel driver events.
- Output from `secrets` cannot be predicted even if previous outputs are known.
- High entropy guarantees protection against brute-force, dictionary, and state-reconstruction attacks.

---

## Instructions for Running

### Requirements
- Python 3.6+
- Uses **only standard library modules** (`secrets`, `string`, `math`, `subprocess`, `sys`, `tkinter`, `unittest`). No third-party package installation (`pip`) is required.

### Running the Interactive CLI
Run the main script directly from your terminal:

```bash
python3 password_generator.py
```

### Running Unit Tests
To run the automated test suite:

```bash
python3 -m unittest test_password_generator.py
```

---

## How It Works

1. **Configuration & Filtering**: The `PasswordGenerator` class constructs active character sets based on user flags. If `exclude_ambiguous` is `True`, ambiguous characters are stripped out.
2. **Guaranteed Character Inclusion**: For every enabled category, `secrets.choice()` selects one character. This guarantees that at least one character from each enabled type is present.
3. **Random Fill**: The remaining password length is populated by selecting characters from the combined pool using `secrets.choice()`.
4. **Secure In-Place Shuffle**: `secrets.SystemRandom().shuffle()` reorders the character array in-place so that category-guaranteed characters do not predictably appear at the beginning of the password string.
5. **Entropy Assessment**: Password strength is calculated using Shannon Entropy ($E = L \times \log_2(R)$ where $L$ is length and $R$ is pool size):
   - **< 40 bits**: Weak
   - **40 - 59 bits**: Medium
   - **60 - 79 bits**: Strong
   - **80+ bits**: Very Strong

---

## Example Usage

### 1. Programmatic API Usage

```python
from password_generator import PasswordGenerator

# Initialize generator with custom settings
gen = PasswordGenerator(
    length=16,
    use_uppercase=True,
    use_lowercase=True,
    use_digits=True,
    use_special=True,
    exclude_ambiguous=True
)

# Generate a single password
password = gen.generate()
print("Generated Password:", password)

# Evaluate strength
strength = gen.evaluate_strength(password)
print(f"Strength Rating: {strength['rating']} ({strength['entropy_bits']} bits entropy)")

# Generate batch of passwords
passwords = gen.generate_multiple(3)
for p in passwords:
    print("Batch Password:", p)
```

### 2. Interactive CLI Example

```
============================================================
      Cryptographically Secure Password Generator
============================================================
Include Uppercase letters (A-Z)? [Y/n]: y
Include Lowercase letters (a-z)? [Y/n]: y
Include Numbers (0-9)? [Y/n]: y
Include Special characters (!@#$%...)? [Y/n]: y
Exclude ambiguous characters (e.g. O, 0, I, l, 1)? [y/N]: y
Enter password length [16]: 18
How many passwords to generate? [1]: 2

------------------------------------------------------------
Generated Password(s):
------------------------------------------------------------
[1] #mK9!qR7$wT4@vP2*x  (Strength: Very Strong ~ 111.02 bits entropy)
[2] &yH3%nE8^uA6!zC5#w  (Strength: Very Strong ~ 111.02 bits entropy)
------------------------------------------------------------
Enter password number (1-2) to copy to clipboard (or press Enter to skip): 1
✓ Password #1 copied to clipboard!

Security Notice: Generated passwords are never stored or logged.
```

---

## Suggestions for Turning It into a GUI Application using Tkinter

`tkinter` is built into Python's standard library, making it ideal for creating a lightweight, native cross-platform GUI for this generator. Below is an architectural blueprint and example implementation for converting this project into a Tkinter application:

### GUI Architecture Blueprint

1. **Layout & Components**:
   - **Length Control**: A `ttk.Scale` (slider) coupled with a `ttk.Spinbox` / `ttk.Label` displaying length (e.g., range 8–64).
   - **Category Checkboxes**: `ttk.Checkbutton` widgets bound to `tk.BooleanVar()` for Uppercase, Lowercase, Numbers, Special, and Exclude Ambiguous.
   - **Quantity Selector**: A `ttk.Spinbox` for number of passwords to generate.
   - **Output Display**: A `ttk.Entry` (or `tk.Text`) displaying the password, marked read-only or with mask options.
   - **Strength Indicator Bar**: A `ttk.Progressbar` styled with custom colors (Red = Weak, Yellow = Medium, Green = Strong, Blue = Very Strong) alongside a label showing entropy bits.
   - **Action Buttons**: "Generate Password" and "Copy to Clipboard" buttons.

### Example Tkinter GUI Implementation Sketch

```python
import tkinter as tk
from tkinter import ttk, messagebox
from password_generator import PasswordGenerator, copy_to_clipboard

class PasswordGeneratorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Secure Password Generator")
        self.root.geometry("450x420")
        self.root.resizable(False, False)

        # Reactive Variables
        self.var_length = tk.IntVar(value=16)
        self.var_upper = tk.BooleanVar(value=True)
        self.var_lower = tk.BooleanVar(value=True)
        self.var_digits = tk.BooleanVar(value=True)
        self.var_special = tk.BooleanVar(value=True)
        self.var_ambiguous = tk.BooleanVar(value=False)
        self.var_password = tk.StringVar(value="")
        self.var_strength = tk.StringVar(value="Strength: -")

        self._build_ui()

    def _build_ui(self):
        frame = ttk.PaddingFrame(self.root, padding=15)
        frame.pack(fill=tk.BOTH, expand=True)

        # Output Field
        ttk.Label(frame, text="Generated Password:").pack(anchor=tk.W)
        pwd_entry = ttk.Entry(frame, textvariable=self.var_password, font=("Courier", 12), state="readonly")
        pwd_entry.pack(fill=tk.X, pady=5)

        # Strength Rating Label
        ttk.Label(frame, textvariable=self.var_strength, font=("Arial", 10, "bold")).pack(anchor=tk.W, pady=2)

        # Options Frame
        opt_frame = ttk.LabelFrame(frame, text=" Settings ")
        opt_frame.pack(fill=tk.X, pady=10, ipady=5)

        ttk.Checkbutton(opt_frame, text="Uppercase Letters (A-Z)", variable=self.var_upper).pack(anchor=tk.W, px=10)
        ttk.Checkbutton(opt_frame, text="Lowercase Letters (a-z)", variable=self.var_lower).pack(anchor=tk.W, px=10)
        ttk.Checkbutton(opt_frame, text="Numbers (0-9)", variable=self.var_digits).pack(anchor=tk.W, px=10)
        ttk.Checkbutton(opt_frame, text="Special Characters (!@#$%)", variable=self.var_special).pack(anchor=tk.W, px=10)
        ttk.Checkbutton(opt_frame, text="Exclude Ambiguous (O, 0, I, l, 1)", variable=self.var_ambiguous).pack(anchor=tk.W, px=10)

        # Length Slider
        len_frame = ttk.Frame(opt_frame)
        len_frame.pack(fill=tk.X, padx=10, pady=5)
        ttk.Label(len_frame, text="Length:").pack(side=tk.LEFT)
        ttk.Scale(len_frame, from_=6, to=64, variable=self.var_length, command=lambda v: self.var_length.set(int(float(v)))).pack(side=tk.LEFT, fill=tk.X, expand=True, padx=5)
        ttk.Label(len_frame, textvariable=self.var_length, width=3).pack(side=tk.LEFT)

        # Action Buttons
        btn_frame = ttk.Frame(frame)
        btn_frame.pack(fill=tk.X, pady=10)
        ttk.Button(btn_frame, text="Generate", command=self.on_generate).pack(side=tk.LEFT, expand=True, fill=tk.X, padx=2)
        ttk.Button(btn_frame, text="Copy to Clipboard", command=self.on_copy).pack(side=tk.RIGHT, expand=True, fill=tk.X, padx=2)

    def on_generate(self):
        try:
            gen = PasswordGenerator(
                length=self.var_length.get(),
                use_uppercase=self.var_upper.get(),
                use_lowercase=self.var_lower.get(),
                use_digits=self.var_digits.get(),
                use_special=self.var_special.get(),
                exclude_ambiguous=self.var_ambiguous.get()
            )
            pwd = gen.generate()
            self.var_password.set(pwd)
            strength = gen.evaluate_strength(pwd)
            self.var_strength.set(f"Strength: {strength['rating']} ({strength['entropy_bits']} bits)")
        except Exception as e:
            messagebox.showerror("Configuration Error", str(e))

    def on_copy(self):
        pwd = self.var_password.get()
        if pwd:
            copy_to_clipboard(pwd)
            messagebox.showinfo("Success", "Password copied to clipboard!")

if __name__ == "__main__":
    root = tk.Tk()
    app = PasswordGeneratorGUI(root)
    root.mainloop()
```

### Key UI Features to Consider
- **Auto-Generate on Change**: Bind generator updates directly to checkbox click events (`command=...`) and scale movement for instant feedback.
- **Show/Hide Toggle**: Provide a checkbox or eye icon to toggle password visibility (e.g., using `show="*"` on `ttk.Entry`).
- **Color-Coded Strength Bar**: Dynamically set canvas/progressbar colors (Red for Weak, Green for Strong) based on the calculated entropy rating.

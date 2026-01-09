#!/bin/bash
# Setup script for local development - creates venv and installs dependencies

set -e

echo "Setting up API local development environment..."

# Find compatible Python version (3.11-3.12 recommended, 3.13 has issues with asyncpg)
# asyncpg doesn't build with Python 3.13 yet, so prefer 3.11 or 3.12
PYTHON_CMD=""

# Try 3.11 and 3.12 first (most compatible), then 3.13 as fallback
for py in python3.11 python3.12 python3.13 python3; do
    if command -v "$py" &> /dev/null; then
        PYTHON_VERSION=$($py --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
        MIN_VERSION="3.11"
        MAX_VERSION="3.13"
        
        # Check if version is between 3.11 and 3.13
        if [ "$(printf '%s\n' "$MIN_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" = "$MIN_VERSION" ] && \
           [ "$(printf '%s\n' "$PYTHON_VERSION" "$MAX_VERSION" | sort -V | head -n1)" = "$PYTHON_VERSION" ]; then
            PYTHON_CMD="$py"
            echo "Using Python $PYTHON_VERSION ($py)"
            # Warn if using 3.13 (asyncpg may not build)
            if [ "$PYTHON_VERSION" = "3.13" ]; then
                echo "Warning: Python 3.13 may have issues building asyncpg. Python 3.11 or 3.12 is recommended."
            fi
            break
        fi
    fi
done

if [ -z "$PYTHON_CMD" ]; then
    echo "Error: Python 3.11 or 3.12 is required (3.13 has known issues with asyncpg)."
    echo "Python 3.14+ is not yet supported by asyncpg and pydantic-core."
    echo ""
    echo "Please install Python 3.11, 3.12, or 3.13:"
    echo "  brew install python@3.13  # or python@3.12, python@3.11"
    echo ""
    echo "Or use Docker mode instead: make install"
    exit 1
fi

# Check if venv exists and was created with compatible Python
RECREATE_VENV=false
if [ -d "venv" ]; then
    if [ -f "venv/pyvenv.cfg" ]; then
        VENV_PYTHON=$(grep "executable" venv/pyvenv.cfg | cut -d'=' -f2 | xargs)
        if [ -n "$VENV_PYTHON" ] && [ "$VENV_PYTHON" != "$($PYTHON_CMD -c 'import sys; print(sys.executable)')" ]; then
            echo "Warning: Existing venv was created with a different Python version."
            echo "Attempting to remove old venv to recreate with $PYTHON_CMD..."
            if rm -rf venv 2>/dev/null; then
                RECREATE_VENV=true
            else
                echo "Error: Could not remove old venv directory (permission denied)."
                echo "Please manually remove it and try again:"
                echo "  rm -rf apps/api/venv"
                exit 1
            fi
        fi
    else
        if rm -rf venv 2>/dev/null; then
            RECREATE_VENV=true
        else
            echo "Error: Could not remove old venv directory (permission denied)."
            echo "Please manually remove it and try again:"
            echo "  rm -rf apps/api/venv"
            exit 1
        fi
    fi
else
    RECREATE_VENV=true
fi

# Create venv if needed
if [ "$RECREATE_VENV" = true ]; then
    echo "Creating virtual environment with $PYTHON_CMD..."
    $PYTHON_CMD -m venv venv
fi

# Activate venv
echo "Activating virtual environment..."
# shellcheck disable=SC1091
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt -r requirements-dev.txt

echo "✓ API local development environment ready!"
echo ""
echo "To activate the virtual environment, run:"
echo "  source venv/bin/activate"
echo ""
echo "To run the API locally:"
echo "  uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

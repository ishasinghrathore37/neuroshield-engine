from setuptools import setup, find_packages

setup(
    name="neuroshield-agent",
    version="1.0.0",
    author="Tera Naam",
    description="AI-Powered Endpoint Security Agent",
    packages=find_packages(),
    install_requires=[
        "psutil",
        "requests",
        "watchdog",
        "schedule",
        "colorama",
        "python-dotenv",
        "click",
    ],
    entry_points={
        "console_scripts": [
            "neuroshield-agent=main:main",
        ],
    },
    python_requires=">=3.8",
)
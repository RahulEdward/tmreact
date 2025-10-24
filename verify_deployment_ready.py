#!/usr/bin/env python3
"""
Pre-Deployment Verification Script
Checks if everything is ready for Vercel deployment
"""
import os
import sys
from pathlib import Path

def print_header(text):
    """Print a formatted header"""
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60)

def check_file(filepath, description):
    """Check if a file exists"""
    if Path(filepath).exists():
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description} NOT FOUND: {filepath}")
        return False

def check_directory(dirpath, description):
    """Check if a directory exists"""
    if Path(dirpath).exists() and Path(dirpath).is_dir():
        print(f"✅ {description}: {dirpath}")
        return True
    else:
        print(f"❌ {description} NOT FOUND: {dirpath}")
        return False

def check_env_file(filepath):
    """Check environment file and show variables"""
    if not Path(filepath).exists():
        print(f"❌ Environment file NOT FOUND: {filepath}")
        return False
    
    print(f"✅ Environment file exists: {filepath}")
    
    # Read and display variables (without values for security)
    try:
        with open(filepath, 'r') as f:
            lines = f.readlines()
            print("   Variables found:")
            for line in lines:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    var_name = line.split('=')[0]
                    print(f"   - {var_name}")
    except Exception as e:
        print(f"   ⚠️  Could not read file: {str(e)}")
    
    return True

def check_database():
    """Check if database exists and has tables"""
    db_path = Path("db/secueralgo.db")
    
    if not db_path.exists():
        print("❌ Database file NOT FOUND: db/secueralgo.db")
        print("   Run: python setup_database.py")
        return False
    
    print("✅ Database file exists: db/secueralgo.db")
    
    # Check tables
    try:
        import sqlite3
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        tables = cursor.fetchall()
        
        required_tables = ['new_users', 'user_sessions', 'broker_connections', 'broker_tokens']
        existing_tables = [t[0] for t in tables]
        
        print("   Tables found:")
        for table in existing_tables:
            status = "✅" if table in required_tables else "ℹ️ "
            print(f"   {status} {table}")
        
        missing = [t for t in required_tables if t not in existing_tables]
        if missing:
            print(f"   ❌ Missing required tables: {', '.join(missing)}")
            print("   Run: python setup_database.py")
            conn.close()
            return False
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"   ⚠️  Could not check tables: {str(e)}")
        return False

def check_vercel_cli():
    """Check if Vercel CLI is installed"""
    import subprocess
    
    try:
        result = subprocess.run(['vercel', '--version'], 
                              capture_output=True, 
                              text=True, 
                              timeout=5)
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"✅ Vercel CLI installed: {version}")
            return True
        else:
            print("❌ Vercel CLI not working properly")
            return False
    except FileNotFoundError:
        print("❌ Vercel CLI NOT INSTALLED")
        print("   Install: npm install -g vercel")
        return False
    except Exception as e:
        print(f"⚠️  Could not check Vercel CLI: {str(e)}")
        return False

def main():
    """Main verification function"""
    print_header("TradingBridge - Deployment Readiness Check")
    
    all_checks_passed = True
    
    # Check 1: Required Files
    print_header("1. Checking Required Files")
    checks = [
        ("app.py", "Main Flask application"),
        ("api/index.py", "Vercel entry point"),
        ("vercel.json", "Backend Vercel config"),
        ("requirements.txt", "Python dependencies"),
        ("nextjs-frontend/package.json", "Frontend package.json"),
        ("nextjs-frontend/vercel.json", "Frontend Vercel config"),
    ]
    
    for filepath, description in checks:
        if not check_file(filepath, description):
            all_checks_passed = False
    
    # Check 2: Directories
    print_header("2. Checking Directories")
    dirs = [
        ("db", "Database directory"),
        ("database", "Database modules"),
        ("blueprints", "Flask blueprints"),
        ("services", "Service modules"),
        ("nextjs-frontend/src", "Frontend source"),
    ]
    
    for dirpath, description in dirs:
        if not check_directory(dirpath, description):
            all_checks_passed = False
    
    # Check 3: Environment Files
    print_header("3. Checking Environment Files")
    if not check_env_file(".env"):
        all_checks_passed = False
    
    print()
    if not check_env_file("nextjs-frontend/.env.local"):
        all_checks_passed = False
    
    print()
    if not check_env_file("nextjs-frontend/.env.production"):
        all_checks_passed = False
    
    # Check 4: Database
    print_header("4. Checking Database")
    if not check_database():
        all_checks_passed = False
    
    # Check 5: Vercel CLI
    print_header("5. Checking Vercel CLI")
    if not check_vercel_cli():
        all_checks_passed = False
    
    # Check 6: Deployment Scripts
    print_header("6. Checking Deployment Scripts")
    scripts = [
        ("deploy-backend.bat", "Backend deployment script"),
        ("deploy-frontend.bat", "Frontend deployment script"),
        ("deploy-all.bat", "Full deployment script"),
    ]
    
    for filepath, description in scripts:
        if not check_file(filepath, description):
            all_checks_passed = False
    
    # Check 7: Documentation
    print_header("7. Checking Documentation")
    docs = [
        ("PRODUCTION_DEPLOYMENT_GUIDE.md", "Complete deployment guide"),
        ("VERCEL_DEPLOYMENT_QUICK_START.md", "Quick start guide"),
        ("AUTHENTICATION_FIX_SUMMARY.md", "Auth system documentation"),
        ("DEPLOYMENT_READY_SUMMARY.md", "Deployment summary"),
    ]
    
    for filepath, description in docs:
        if not check_file(filepath, description):
            all_checks_passed = False
    
    # Final Summary
    print_header("Verification Summary")
    
    if all_checks_passed:
        print("✅ ALL CHECKS PASSED!")
        print()
        print("Your application is ready for deployment!")
        print()
        print("Next Steps:")
        print("1. Run: deploy-all.bat (Windows)")
        print("2. Or follow: VERCEL_DEPLOYMENT_QUICK_START.md")
        print()
        print("🚀 Ready to deploy to Vercel!")
        return 0
    else:
        print("❌ SOME CHECKS FAILED")
        print()
        print("Please fix the issues above before deploying.")
        print()
        print("Common fixes:")
        print("- Run: python setup_database.py (for database)")
        print("- Run: npm install -g vercel (for Vercel CLI)")
        print("- Check .env files are configured")
        print()
        return 1

if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""
React to Flask Deployment Script

This script automates the process of building the React frontend
and integrating it with the Flask backend.
"""

import os
import sys
import shutil
import subprocess
import json
from pathlib import Path
from datetime import datetime

class ReactFlaskDeployer:
    def __init__(self):
        self.script_dir = Path(__file__).parent
        self.react_dir = self.script_dir
        self.flask_dir = self.script_dir.parent
        self.build_dir = self.react_dir / 'dist'
        self.flask_static_dir = self.flask_dir / 'static' / 'react'
        
    def log(self, message, level='INFO'):
        """Log message with timestamp"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {level}: {message}")
    
    def run_command(self, command, cwd=None):
        """Run shell command and return result"""
        try:
            result = subprocess.run(
                command, 
                shell=True, 
                cwd=cwd or self.react_dir,
                capture_output=True, 
                text=True, 
                check=True
            )
            return True, result.stdout
        except subprocess.CalledProcessError as e:
            self.log(f"Command failed: {command}", 'ERROR')
            self.log(f"Error: {e.stderr}", 'ERROR')
            return False, e.stderr
    
    def check_prerequisites(self):
        """Check if all prerequisites are met"""
        self.log("Checking prerequisites...")
        
        # Check if we're in the right directory
        if not (self.react_dir / 'package.json').exists():
            self.log("package.json not found. Are you in the React directory?", 'ERROR')
            return False
        
        # Check if Flask directory exists
        if not self.flask_dir.exists():
            self.log("Flask directory not found", 'ERROR')
            return False
        
        # Check if node_modules exists
        if not (self.react_dir / 'node_modules').exists():
            self.log("node_modules not found. Installing dependencies...")
            success, output = self.run_command('npm install')
            if not success:
                return False
        
        self.log("Prerequisites check passed")
        return True
    
    def run_type_check(self):
        """Run TypeScript type checking"""
        self.log("Running TypeScript type check...")
        success, output = self.run_command('npm run type-check')
        if not success:
            self.log("Type check failed. Please fix TypeScript errors before deploying.", 'ERROR')
            return False
        
        self.log("Type check passed")
        return True
    
    def build_react_app(self):
        """Build React application for production"""
        self.log("Building React application...")
        
        # Clean previous build
        if self.build_dir.exists():
            shutil.rmtree(self.build_dir)
            self.log("Cleaned previous build")
        
        # Build for production
        success, output = self.run_command('npm run build')
        if not success:
            self.log("React build failed", 'ERROR')
            return False
        
        # Verify build output
        if not self.build_dir.exists() or not (self.build_dir / 'index.html').exists():
            self.log("Build output not found", 'ERROR')
            return False
        
        self.log("React build completed successfully")
        return True
    
    def copy_to_flask(self):
        """Copy build files to Flask static directory"""
        self.log("Copying build files to Flask static directory...")
        
        # Create Flask static directory if it doesn't exist
        self.flask_static_dir.mkdir(parents=True, exist_ok=True)
        
        # Remove existing React files
        if self.flask_static_dir.exists():
            for item in self.flask_static_dir.iterdir():
                if item.is_dir():
                    shutil.rmtree(item)
                else:
                    item.unlink()
        
        # Copy build files
        try:
            for item in self.build_dir.iterdir():
                if item.is_dir():
                    shutil.copytree(item, self.flask_static_dir / item.name)
                else:
                    shutil.copy2(item, self.flask_static_dir / item.name)
            
            self.log(f"Files copied to {self.flask_static_dir}")
            return True
        except Exception as e:
            self.log(f"Failed to copy files: {e}", 'ERROR')
            return False
    
    def create_deployment_info(self):
        """Create deployment information file"""
        deployment_info = {
            'deployment_time': datetime.now().isoformat(),
            'react_version': self.get_react_version(),
            'build_hash': self.get_build_hash(),
            'files_count': len(list(self.flask_static_dir.rglob('*'))),
            'deployment_script_version': '1.0.0'
        }
        
        info_file = self.flask_static_dir / 'deployment-info.json'
        with open(info_file, 'w') as f:
            json.dump(deployment_info, f, indent=2)
        
        self.log("Created deployment info file")
        return deployment_info
    
    def get_react_version(self):
        """Get React version from package.json"""
        try:
            with open(self.react_dir / 'package.json', 'r') as f:
                package_data = json.load(f)
                return package_data.get('dependencies', {}).get('react', 'unknown')
        except:
            return 'unknown'
    
    def get_build_hash(self):
        """Generate a simple hash for the build"""
        try:
            index_file = self.flask_static_dir / 'index.html'
            if index_file.exists():
                return str(hash(index_file.read_text()))[:8]
        except:
            pass
        return 'unknown'
    
    def update_flask_integration(self):
        """Update Flask app with React integration"""
        self.log("Checking Flask integration...")
        
        app_py = self.flask_dir / 'app.py'
        if not app_py.exists():
            self.log("Flask app.py not found", 'WARNING')
            return False
        
        # Read current app.py
        with open(app_py, 'r') as f:
            app_content = f.read()
        
        # Check if React integration is already added
        if 'setup_react_integration' in app_content:
            self.log("React integration already present in app.py")
            return True
        
        self.log("React integration not found in app.py")
        self.log("Please manually add the integration code from flask-integration-example.py", 'WARNING')
        return False
    
    def create_env_config(self):
        """Create environment configuration for React"""
        env_file = self.flask_dir / '.env.react'
        if env_file.exists():
            self.log("React environment config already exists")
            return
        
        env_content = """# React Frontend Configuration
SERVE_REACT_FRONTEND=false
ENABLE_CORS_DEV=false

# Set to true to serve React frontend instead of Flask templates
# SERVE_REACT_FRONTEND=true

# Set to true to enable CORS for development
# ENABLE_CORS_DEV=true
"""
        
        with open(env_file, 'w') as f:
            f.write(env_content)
        
        self.log(f"Created React environment config: {env_file}")
    
    def print_deployment_summary(self, deployment_info):
        """Print deployment summary"""
        self.log("=" * 60)
        self.log("DEPLOYMENT COMPLETED SUCCESSFULLY!")
        self.log("=" * 60)
        self.log(f"Deployment time: {deployment_info['deployment_time']}")
        self.log(f"React version: {deployment_info['react_version']}")
        self.log(f"Build hash: {deployment_info['build_hash']}")
        self.log(f"Files deployed: {deployment_info['files_count']}")
        self.log("")
        self.log("Next steps:")
        self.log("1. Set SERVE_REACT_FRONTEND=true in your .env file")
        self.log("2. Restart your Flask application")
        self.log("3. Visit your Flask app to see the React frontend")
        self.log("")
        self.log("To rollback to Flask templates:")
        self.log("1. Set SERVE_REACT_FRONTEND=false in your .env file")
        self.log("2. Restart your Flask application")
        self.log("=" * 60)
    
    def deploy(self, skip_type_check=False):
        """Run complete deployment process"""
        self.log("Starting React to Flask deployment...")
        
        # Check prerequisites
        if not self.check_prerequisites():
            return False
        
        # Run type check (optional)
        if not skip_type_check and not self.run_type_check():
            return False
        
        # Build React app
        if not self.build_react_app():
            return False
        
        # Copy to Flask
        if not self.copy_to_flask():
            return False
        
        # Create deployment info
        deployment_info = self.create_deployment_info()
        
        # Update Flask integration
        self.update_flask_integration()
        
        # Create environment config
        self.create_env_config()
        
        # Print summary
        self.print_deployment_summary(deployment_info)
        
        return True

def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Deploy React frontend to Flask backend')
    parser.add_argument('--skip-type-check', action='store_true', 
                       help='Skip TypeScript type checking')
    parser.add_argument('--dry-run', action='store_true',
                       help='Show what would be done without actually doing it')
    
    args = parser.parse_args()
    
    deployer = ReactFlaskDeployer()
    
    if args.dry_run:
        print("DRY RUN MODE - No changes will be made")
        print(f"React directory: {deployer.react_dir}")
        print(f"Flask directory: {deployer.flask_dir}")
        print(f"Build directory: {deployer.build_dir}")
        print(f"Flask static directory: {deployer.flask_static_dir}")
        return
    
    success = deployer.deploy(skip_type_check=args.skip_type_check)
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
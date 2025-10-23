import { useState, useCallback } from "react";
import { newAuth } from "@/lib/new-auth";

export interface ValidationErrors {
  [key: string]: string;
}

export interface ValidationSuggestions {
  [key: string]: string;
}

export interface UseAuthValidationReturn {
  errors: ValidationErrors;
  suggestions: ValidationSuggestions;
  isValidating: boolean;
  validateField: (field: string, value: string, additionalData?: Record<string, string>) => Promise<boolean>;
  validateForm: (data: Record<string, string>) => Promise<boolean>;
  clearErrors: () => void;
  clearFieldError: (field: string) => void;
  setError: (field: string, message: string) => void;
}

export function useAuthValidation(): UseAuthValidationReturn {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [suggestions, setSuggestions] = useState<ValidationSuggestions>({});
  const [isValidating, setIsValidating] = useState(false);

  const clearErrors = useCallback(() => {
    setErrors({});
    setSuggestions({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    setSuggestions(prev => {
      const newSuggestions = { ...prev };
      delete newSuggestions[field];
      return newSuggestions;
    });
  }, []);

  const setError = useCallback((field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const validateEmail = (email: string): { valid: boolean; message?: string } => {
    if (!email.trim()) {
      return { valid: false, message: "Email is required" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: "Please enter a valid email address" };
    }

    return { valid: true };
  };

  const validateUsername = (username: string): { valid: boolean; message?: string } => {
    if (!username.trim()) {
      return { valid: false, message: "Username is required" };
    }

    if (username.length < 3) {
      return { valid: false, message: "Username must be at least 3 characters" };
    }

    if (username.length > 50) {
      return { valid: false, message: "Username must be less than 50 characters" };
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return { valid: false, message: "Username can only contain letters, numbers, and underscores" };
    }

    return { valid: true };
  };

  const validatePassword = (password: string): { valid: boolean; message?: string } => {
    if (!password) {
      return { valid: false, message: "Password is required" };
    }

    if (password.length < 8) {
      return { valid: false, message: "Password must be at least 8 characters" };
    }

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!hasUppercase) {
      return { valid: false, message: "Password must contain at least one uppercase letter" };
    }

    if (!hasLowercase) {
      return { valid: false, message: "Password must contain at least one lowercase letter" };
    }

    if (!hasNumbers) {
      return { valid: false, message: "Password must contain at least one number" };
    }

    return { valid: true };
  };

  const validateEmailOrUsername = (value: string): { valid: boolean; message?: string } => {
    if (!value.trim()) {
      return { valid: false, message: "Email or username is required" };
    }

    if (value.includes("@")) {
      return validateEmail(value);
    } else {
      return validateUsername(value);
    }
  };

  const validateField = useCallback(async (
    field: string, 
    value: string, 
    additionalData?: Record<string, string>
  ): Promise<boolean> => {
    // Clear existing error for this field
    clearFieldError(field);

    let validation: { valid: boolean; message?: string };

    // Client-side validation
    switch (field) {
      case "email":
        validation = validateEmail(value);
        break;
      case "username":
        validation = validateUsername(value);
        break;
      case "password":
        validation = validatePassword(value);
        break;
      case "emailOrUsername":
        validation = validateEmailOrUsername(value);
        break;
      default:
        validation = { valid: true };
    }

    if (!validation.valid && validation.message) {
      setError(field, validation.message);
      return false;
    }

    // Server-side validation for registration fields
    if ((field === "username" || field === "email" || field === "password") && additionalData) {
      setIsValidating(true);
      try {
        const response = await newAuth.validateRegistration(
          additionalData.username || "",
          additionalData.email || "",
          additionalData.password || ""
        );

        if (!response.valid && response.errors[field]) {
          setError(field, response.errors[field]);
          if (response.suggestions[field]) {
            setSuggestions(prev => ({ ...prev, [field]: response.suggestions[field] }));
          }
          return false;
        }
      } catch (error) {
        console.error("Server validation error:", error);
        // Don't fail validation on server error, rely on client-side validation
      } finally {
        setIsValidating(false);
      }
    }

    return true;
  }, [clearFieldError, setError]);

  const validateForm = useCallback(async (data: Record<string, string>): Promise<boolean> => {
    clearErrors();
    setIsValidating(true);

    try {
      let isValid = true;
      const newErrors: ValidationErrors = {};
      const newSuggestions: ValidationSuggestions = {};

      // Validate each field
      for (const [field, value] of Object.entries(data)) {
        let validation: { valid: boolean; message?: string };

        switch (field) {
          case "email":
            validation = validateEmail(value);
            break;
          case "username":
            validation = validateUsername(value);
            break;
          case "password":
            validation = validatePassword(value);
            break;
          case "emailOrUsername":
            validation = validateEmailOrUsername(value);
            break;
          default:
            validation = { valid: true };
        }

        if (!validation.valid && validation.message) {
          newErrors[field] = validation.message;
          isValid = false;
        }
      }

      // If client-side validation passes and we have registration data, do server-side validation
      if (isValid && data.username && data.email && data.password) {
        try {
          const response = await newAuth.validateRegistration(
            data.username,
            data.email,
            data.password
          );

          if (!response.valid) {
            Object.assign(newErrors, response.errors);
            Object.assign(newSuggestions, response.suggestions);
            isValid = false;
          }
        } catch (error) {
          console.error("Server validation error:", error);
          // Don't fail validation on server error
        }
      }

      setErrors(newErrors);
      setSuggestions(newSuggestions);
      return isValid;
    } finally {
      setIsValidating(false);
    }
  }, [clearErrors]);

  return {
    errors,
    suggestions,
    isValidating,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
    setError,
  };
}
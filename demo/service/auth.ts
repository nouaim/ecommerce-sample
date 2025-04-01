import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";

// User roles
export type UserRole = "admin" | "user" | "guest";

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Mock users for demo purposes
const USERS: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    email: "user@example.com",
    name: "Regular User",
    role: "user",
  },
];

// Current user state
let currentUser: User | null = null;

// Login function
export const login = (
  email: string,
  password: string
): Promise<User | null> => {
  const toast = React.useRef<Toast>(null);
  return new Promise((resolve) => {
    // For demo purposes, we'll just check if the email exists in our mock data
    // In a real app, you would check against a backend with proper password hashing
    const user = USERS.find((u) => u.email === email);

    setTimeout(() => {
      if (user) {
        // In a real app, you'd validate the password here
        localStorage.setItem("user", JSON.stringify(user));
        currentUser = user;
        // toast({
        //   title: "Login successful",
        //   description: `Welcome back, ${user.name}!`,
        // });
        toast.current?.show({
          severity: "success",
          summary: "Login successful",
          detail: `Welcome back, ${user.name}!`,
          life: 3000,
        });
        resolve(user);
      } else {
        // toast({
        //   title: "Login failed",
        //   description: "Invalid email or password",
        //   variant: "destructive",
        // });
        toast.current?.show({
          summary: "Login failed",
          detail: "Invalid email or password",
          life: 3000,
        });
        resolve(null);
      }
    }, 500); // Simulate network delay
  });
};

// Logout function
export const logout = (): void => {
  const toast = React.useRef<Toast>(null);

  localStorage.removeItem("user");
  currentUser = null;
  toast.current?.show({
    severity: "success",
    summary: "Logged out",
    detail: 'You have been logged out successfully',
    life: 3000,
  });
};

// Get current user
export const getCurrentUser = (): User | null => {
  if (currentUser) return currentUser;

  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }
  return null;
};

// Check if user has specific role
export const hasRole = (role: UserRole): boolean => {
  const user = getCurrentUser();
  if (!user) return false;

  // Admin has all privileges
  if (user.role === "admin") return true;

  // Otherwise check for exact role match
  return user.role === role;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Permission check for specific actions
export const canPerformAction = (
  action: "create" | "update" | "delete"
): boolean => {
  const user = getCurrentUser();
  if (!user) return false;

  // Admins can do everything
  if (user.role === "admin") return true;

  // Regular users can only update
  if (user.role === "user") return action === "update";

  // Guests can't perform any actions
  return false;
};

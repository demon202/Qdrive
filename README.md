# Qdrive – Modern File Storage & Management Platform  

Live demo: [qdrive.vercel.app](https://qdrive.vercel.app/)  

Qdrive is a full-stack storage management platform built with Next.js and Appwrite. It demonstrates real-world application architecture, authentication flows, and scalable file handling. The project emphasizes usability, clean design, and secure backend integration, making it both a developer showcase and a practical solution.  

## Tech Stack  
- **React 19**  
- **Next.js 15 (App Router)**  
- **TypeScript**  
- **Appwrite (Auth, Storage, Database)**  
- **TailwindCSS**  
- **ShadCN/UI**  

## Features  

- **Authentication**: Secure signup, login, and OTP-based verification with retry logic and auto-submit patterns aligned with industry practices.  
- **File Upload & Management**: Upload documents, images, videos, and audio. Browse, preview in a new tab, rename, or delete files directly from the dashboard.  
- **File Downloads & Sharing**: Download content or share files seamlessly using Appwrite storage links.  
- **Storage Insights**: Real-time calculation of total storage used, displayed in KB, MB, or GB. Files categorized by type (image, video, audio, document, other).  
- **Dashboard Overview**: Responsive dashboard with usage metrics, recent uploads, and file distribution summaries.  
- **Global Search & Sorting**: Quickly find files across the platform and sort results by name, size, or date.  
- **Responsive UI**: Minimalist and modern interface built with TailwindCSS and ShadCN, optimized for desktop and mobile.  
- **Scalable Code Architecture**: Modular, reusable components with server actions and utilities for maintainability and growth.  

## Why Qdrive  

Qdrive demonstrates how to architect a production-ready storage solution with Appwrite while integrating authentication, file operations, and user-friendly dashboards. It showcases best practices in Next.js, TypeScript, and Appwrite integration — serving as both a strong learning resource for developers and a proof of capability for recruiters.  

---

## Changelog  

### v1.1 – PWA Support   
- Added **Progressive Web App (PWA) functionality** using `next-pwa`.  
- Offline caching for faster load times and resilience in low-connectivity environments.  
- Installable as a standalone app on desktop and mobile devices.  
- Custom app icons generated for multiple resolutions.

### v1.0 – Initial Launch   
- Core authentication system with OTP support.  
- File upload, preview, rename, delete, and sharing capabilities.  
- Dashboard with usage metrics and storage insights.  
- Global search, sorting, and file categorization.  
- Responsive UI with TailwindCSS and ShadCN.  

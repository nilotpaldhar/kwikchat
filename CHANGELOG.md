# Changelog

All notable changes to this project will be documented in this file.  
This project follows [Semantic Versioning](https://semver.org) and the [Keep a Changelog](https://keepachangelog.com) format.

---

## [0.11.0] - 2025-04-03

### Added
- Support for uploading and previewing documents and images in messenger chat
- `DocumentPicker`, `ImagePicker`, and `ImageGalleryDialog` components
- Shared media view (`SharedMediaDirectory`) in chat
- DocumentMessage and ImageMessage types in `ChatMessageFactory`

### Changed
- Enhanced `deleteMessage` to remove message content and attached media

---

## [0.10.0] - 2025-02-25

### Added
- Global 404 Not Found page
- Landing page with responsive layout including header, footer, features, FAQs, CTA, and tech stack dialog
- Smooth scrolling with `SmoothScrollLink`

---

## [0.9.0] - 2025-01-16

### Added
- SEO configuration for auth, settings, and messenger routes

---

## [0.8.0] - 2025-01-14

### Added
- Real-time messenger features: chat deletion, UI improvements
- `OnlineFriendsList`, `ChatWelcome`, `ConversationsList` components
- Modular Prisma schema structure

### Fixed
- Friend management real-time sync bug

---

## [0.7.1] - 2024-12-06

### Fixed
- Auth compatibility by replacing `bcryptjs` with `bcrypt-edge`

### Changed
- Upgraded major dependencies including Next.js, React, and Prisma
- Updated UI dependencies

---

## [0.7.0] - 2024-12-04

### Added
- Group chat support with member role updates and removal
- Group creation and exit functionality

---

## [0.6.0] - 2024-10-17

### Added
- Full-featured private chat with:
  - Real-time messaging
  - Seen status
  - Message starring
  - Message reactions
  - Message deletion
  - Empty states
  - New Chat Dialog

---

## [0.5.0] - 2024-09-11

### Added
- Friends, Online Friends, and Blocked Users pages
- Friend request system (send, list pending)
- Real-time updates with Pusher
- Messenger layout and core messaging pages

### Fixed
- Pusher initialization bug

---

## [0.4.0] - 2024-08-08

### Added
- Settings layout with Account, Profile, and Security sections

---

## [0.3.0] - 2024-06-23

### Added
- Full authentication system:
  - Sign-in, sign-up, reset password screens
  - Two-factor authentication
  - Custom error pages
  - Email templates
- Database schema for `User`, `UserSettings`, `Account`
- Auth server actions (sign-in/out/reset/2FA)

---

## [0.1.0] - 2024-05-31

### Added
- Initial project setup
- CI and release workflows
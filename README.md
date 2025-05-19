# 🔗 Linky 
![Forks](https://img.shields.io/github/forks/vencordthemer/linky?color=blue&labelColor=grey)
	![Watchers](https://img.shields.io/github/watchers/vencordthemer/linky?color=blue&labelColor=grey)
 	![Stars](https://img.shields.io/github/stars/vencordthemer/linky?color=blue&labelColor=grey)


 
 ![License](https://img.shields.io/github/license/vencordthemer/linky?color=blue&labelColor=grey)
![PRs](https://img.shields.io/github/issues-pr/vencordthemer/linky?color=blue&labelColor=grey)
![Issues](https://img.shields.io/github/issues/vencordthemer/linky?color=blue&labelColor=grey)
![Last Commit](https://img.shields.io/github/last-commit/vencordthemer/linky?color=blue&labelColor=grey)
 ![Commits](https://img.shields.io/github/commit-activity/m/vencordthemer/linky)
 	![Repo Size](https://img.shields.io/github/repo-size/vencordthemer/linky)
![Contributors](https://img.shields.io/github/contributors/vencordthemer/linky?color=blue&labelColor=grey)  ![Website](https://img.shields.io/website?url=https://linky-s.pages.dev&color=blue&label=linky.pages.dev&labelColor=grey)
![Lines of Code](https://tokei.rs/b1/github/vencordthemer/linky)







[![Linky GitHub Status](https://linky-github-status-svg.vercel.app/status.svg)](https://linky.statuspage.io/)




---







This is a bare-bones Linktree clone using [Vite](https://vite.dev/) and [Firebase](https://console.firebase.google.com/u/0/).


## 🔽 Installation

clone this repo:


 ```bash
git clone https://github.com/vencordthemer/linky
cd linky
 ```

Then, install dependancies:

 ```bash
npm i
 ```
###   🔥 Firebase

Go to the [Firebase Console](https://console.firebase.google.com/u/0/)

Create a project

When you done that go to the `Authentication` and enable `Email and password` and `Google`

***

### 🔥📦 Firestore

Go to the `Cloud Firestore` tab and enable it in production

When created add these rules :

```js
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {

            // User Profiles: Public read, only owner can create/update
            match /users/{userId} {
              allow read: if true; // Anyone can read profile data (username, theme, etc.)
              allow create: if request.auth != null && request.auth.uid == userId; // Only the authenticated user can create their profile
              allow update: if request.auth != null && request.auth.uid == userId; // Only the authenticated user can update their profile
              // Deny delete for now
            }

            // Links: Public read, only owner can CRUD
            match /links/{linkId} {
              allow read: if true; // Anyone can read links for public display
              allow create: if request.auth != null && request.resource.data.userId == request.auth.uid; // User must be logged in and the link's userId must match theirs
              allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid; // User must be logged in and own the link (check existing resource)
            }
          }
        }

```

(You may need to index the links collection)

***

### 🔥🌐 Firebase Web App 
Make a `Web App` by going to the project overview and clicking on </> and creating a app. You will get some code from this and you should copy this part :
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```
and add it to `src/firebase.js`

## 💻 Usage

Start the server:
```
npm run dev
```
## :shield: Badge

I have designed a badge for people to put on their README.

### 🖼 Preview

<a href="https://linky-s.pages.dev/user/example">
  <img src="https://linky-s.pages.dev/badge.jpg" alt="Find Me On Linky" width="125"/>
</a>

### 👨‍💻 Code

```
<a href="https://linky-s.pages.dev/user/YOUR_USERNAME">
  <img src="https://linky-s.pages.dev/badge.jpg" alt="Find Me On Linky" width="125"/>
</a>
```


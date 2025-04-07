# Linky 
This is a bare-bones Linktree clone using [Vite](https://vite.dev/) and [Firebase](https://console.firebase.google.com/u/0/).

## Installation

clone this repo:


 ```bash
git clone https://github.com/vencordthemer/linky
cd linky
 ```

Then, install dependancies:

 ```bash
npm i
 ```
### Firebase

Go to the [Firebase Console](https://console.firebase.google.com/u/0/)

Create a project

When you done that go to the `Authentication` and enable `Email and password` and `Google`

***

### Firestore

Go to the `Cloud Firestore` tab and enable it in production

When created add these rules :

```
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


***

### Firebase Web App 
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

## Usage

Start the server:
```
npm run dev
```

# 💪 GymBro

**GymBro** is a mobile workout and fitness tracking application built with **React Native** and **Expo**.

The goal of GymBro is to provide a simple and intuitive way to create workouts, manage exercises, record sets and repetitions, and keep track of training progress.

---

## 📱 About the Project

GymBro is designed for people who want a straightforward way to organize their gym workouts and keep their training history in one place.

The application focuses on simplicity and usability, allowing users to create and manage workouts without unnecessary complexity.

The project is being developed as a modern cross-platform mobile application using React Native and Expo.

---

## ✨ Features

### 🏋️ Workout Management

- Create workouts
- Edit workouts
- Delete workouts
- Organize exercises within workouts
- Add multiple exercises to a workout
- Manage sets and repetitions
- Record training weights

### 💪 Exercise Management

- Add exercises to workouts
- Edit exercise information
- Remove exercises
- Add exercise images
- Display exercises using reusable exercise cards

### 📊 Training Tracking

GymBro allows users to record important training information such as:

- Exercise
- Weight
- Repetitions
- Sets
- Workout sessions

This provides the foundation for tracking progress and improving training performance over time.

### 📳 Mobile Experience

- Native mobile interface
- Responsive layout
- Touch-friendly controls
- Haptic feedback
- Image selection from the device
- Designed for both iOS and Android

---

## 🛠️ Tech Stack

GymBro is built using the following technologies:

| Technology        | Purpose                             |
| ----------------- | ----------------------------------- |
| React Native      | Mobile application framework        |
| Expo              | Development and deployment platform |
| TypeScript        | Type-safe JavaScript                |
| Expo Router       | Application navigation              |
| Expo Haptics      | Haptic feedback                     |
| Expo Image Picker | Selecting images from the device    |
| EAS               | Build and deployment                |

---

## 📸 Screenshots

Screenshots of the application will be added here as the project develops.

### Home Screen

_Add screenshot here_

### Workout Screen

_Add screenshot here_

### Exercise Screen

_Add screenshot here_

### Workout Tracking

_Add screenshot here_

---

## 🚀 Getting Started

Follow the instructions below to run GymBro locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm
- Expo
- Expo Go (optional, for testing on a physical device)

---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/gymbro.git
```

Navigate to the project directory:

```bash
cd gymbro
```

Install dependencies:

```bash
npm install
```

---

## ▶️ Running the Application

Start the Expo development server:

```bash
npx expo start
```

After starting the development server, you can run GymBro using:

- iOS Simulator
- Android Emulator
- Expo Go on a physical iPhone
- Expo Go on an Android device

---

## 🍎 iOS Development

To run the application on the iOS simulator:

```bash
npx expo start --ios
```

A Mac with Xcode installed is required for local iOS simulator development.

---

## 🤖 Android Development

To run the application on an Android emulator:

```bash
npx expo start --android
```

---

## 📂 Project Structure

The project follows a component-based React Native architecture.

```text
GymBro/
│
├── app/
│   ├── index.tsx
│   └── ...
│
├── components/
│   ├── WorkoutCard.tsx
│   ├── ExerciseCard.tsx
│   └── ...
│
├── assets/
│   ├── images/
│   └── ...
│
├── constants/
│   └── ...
│
├── hooks/
│   └── ...
│
├── package.json
├── app.json
├── eas.json
├── tsconfig.json
└── README.md
```

The exact structure may change as new features are added.

---

## 🧩 Components

GymBro uses reusable React Native components to keep the application modular and maintainable.

For example:

### `WorkoutCard`

Responsible for displaying workout information and providing workout-related actions.

### `ExerciseCard`

Responsible for displaying exercise information and allowing users to interact with individual exercises.

Reusable components make it easier to maintain the application and add new functionality.

---

## 🏋️ Workout Structure

GymBro is designed to support structured workout routines.

A typical training program can contain different workout types such as:

### Push

- Chest
- Shoulders
- Triceps

### Pull

- Back
- Biceps
- Rear delts

### Legs & Core

- Quadriceps
- Hamstrings
- Glutes
- Calves
- Core

Users can organize exercises according to their own training preferences.

---

## 📈 Future Development

GymBro is an ongoing project.

Planned improvements and features include:

- [ ] Workout history
- [ ] Training statistics
- [ ] Progress charts
- [ ] Personal records
- [ ] Exercise library
- [ ] Rest timer
- [ ] Workout timer
- [ ] User authentication
- [ ] Cloud synchronization
- [ ] Backup and restore
- [ ] Push notifications
- [ ] Exercise search
- [ ] More detailed workout statistics
- [ ] Personal training goals
- [ ] Apple Health integration
- [ ] Google Health / Fitness integration

The roadmap may change as development continues.

---

## 📦 Building the Application

GymBro uses **Expo Application Services (EAS)** for application builds and deployment.

### Development Build

```bash
eas build --profile development
```

### iOS Production Build

```bash
eas build --platform ios
```

### Android Production Build

```bash
eas build --platform android
```

---

## 🔄 Over-the-Air Updates

GymBro can use Expo EAS Update to distribute JavaScript and application updates without creating a completely new native build for every change.

Example:

```bash
eas update --channel production --message "GymBro update" --environment production
```

---

## 🔐 Environment Variables

Sensitive information such as API keys, tokens, passwords, or private credentials should never be committed to the Git repository.

Environment variables should be stored using an appropriate environment configuration.

Example:

```env
API_URL=your_api_url
```

Never commit sensitive `.env` files to GitHub.

---

## 🧪 Testing

Before releasing a new version, the application should be tested on both supported platforms.

Testing should include:

- iOS
- Android
- Different screen sizes
- Workout creation
- Exercise creation
- Editing workouts
- Deleting workouts
- Adding images
- Recording sets and repetitions
- Navigation
- Application restart
- Data persistence

---

## 🐛 Known Issues

This section will contain known bugs and limitations as they are discovered during development.

If you find a problem, please create an issue describing:

1. What happened
2. What you expected to happen
3. Steps to reproduce the problem
4. Device and operating system
5. Relevant screenshots or error messages

---

## 🗺️ Roadmap

### Version 1.0

- [x] Initial application
- [x] Workout creation
- [x] Exercise management
- [x] Workout cards
- [x] Exercise cards
- [x] Set and repetition tracking
- [x] Weight tracking
- [x] Image picker
- [x] Haptic feedback

### Version 1.1

- [ ] Workout history
- [ ] Improved statistics
- [ ] Progress tracking
- [ ] Personal records

### Version 2.0

- [ ] User accounts
- [ ] Cloud synchronization
- [ ] Multiple devices
- [ ] Advanced statistics
- [ ] Health platform integration

---

## 🔒 Privacy

GymBro is designed with user privacy in mind.

The application should only request permissions that are necessary for its functionality.

If the application uses external services in the future, details about data collection and processing will be documented here.

---

## 🤝 Contributing

GymBro is currently under active development.

If you would like to contribute:

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/new-feature
```

3. Make your changes
4. Commit your changes

```bash
git add .
git commit -m "Add new feature"
```

5. Push the branch

```bash
git push origin feature/new-feature
```

6. Open a Pull Request

---

## 📄 License

This project is currently for personal and educational purposes.

License information will be added as the project develops.

---

## 👨‍💻 Author

**Pavle Jovanovic**

GymBro is developed using React Native, Expo and TypeScript.

---

## ❤️ Project Status

GymBro is currently under active development.

The application is continuously being improved with new features, UI improvements, performance optimizations and better workout tracking.

---

## ⭐ Support

If you find the project interesting, consider giving the repository a ⭐ on GitHub.

More features and improvements are coming soon.

---

**Built with 💪 and ❤️ using React Native + Expo**

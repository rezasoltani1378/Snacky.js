# snacky.js 
👉 [**Live Demo**](https://rezasoltani1378.github.io/Snacky.js/index.html)



<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img alt="Size" src="https://img.shields.io/bundlephobia/minzip/snacky?label=size&style=flat-square" /> 
 
  <a href="LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

A professional, zero-dependency, and highly customizable snackbar notification library for the modern web. Created by **Mohammadreza Soltani**.

![snacky.js demo](https://github.com/rezasoltani1378/Snacky.js/blob/main/ezgif-7e23db2d6d308f5c.gif)

`snacky.js` provides a simple API to create beautiful, responsive, and performant notifications that feel native on both desktop and mobile.

## ✨ Key Features

*   **Zero Dependency:** Just one lightweight JavaScript file. No frameworks needed.
*   **Professional API:** Simple and intuitive to use: `snacky.show("Hello, world!")`.
*   **Animated Icons:** The 4 core notification types (`success`, `error`, `warning`, `info`) feature beautiful SVG drawing animations.
*   **Robust Text Handling:** Long messages are handled gracefully with an elegant fade mask, preventing layout breaks.
*   **Highly Customizable:** Control position, duration, type, direction (RTL support), progress bars, and more.
*   **Hyper-Responsive:** Looks great on desktop and automatically adapts to a native full-width UI on mobile screens.
*   **Lightweight & Performant:** Capped notifications prevent DOM flooding and ensure a smooth UI, even when called rapidly.
*   **Accessible:** Optional sound and vibration effects for enhanced user feedback.

## 🚀 Installation & Usage

Getting started with snacky.js is incredibly easy.

### Method 1: Use a CDN (Recommended)

Simply add this script tag to the bottom of your HTML body.

```html
<script src="https://cdn.jsdelivr.net/gh/rezasoltani1378/snacky.js/snacky.js"></script>

```

### Method 2: Manual Installation

1.  Download `snacky.js` from this repository.
2.  Include it in your project:

```html
<script src="path/to/snacky.js"></script>
```

### Basic Usage

Call `snacky.show()` anywhere in your script.

```javascript
// A simple success message
snacky.show("Your profile has been updated!");

// An error message with custom options
snacky.show("Connection failed. Please check your network.", {
  type: 'error',
  position: 'topRight',
  duration: 5000,
  progressBar: 'show'
});
```

## ⚙️ API Reference

Customize every aspect of your notifications by passing an options object as the second argument to `snacky.show(message, options)`.

| Option          | Type                      | Description                                                  | Default         |
| --------------- | ------------------------- | ------------------------------------------------------------ | --------------- |
| `direction`     | `'ltr'` \| `'rtl'`        | Sets the text and layout direction.                          | `'ltr'`         |
| `type`          | `string`                  | Determines the icon and color. 12 types available (see demo). | `'info'`        |
| `position`      | `string`                  | Where the snackbar appears on desktop screens.               | `'bottomRight'` |
| `icon`          | `'show'` \| `'hidden'`    | Shows or hides the icon.                                     | `'show'`        |
| `progressBar`   | `'show'` \| `'hidden'`    | Shows or hides the duration progress bar.                    | `'hidden'`      |
| `autoHide`      | `boolean`                 | If `false`, the snackbar stays until manually dismissed.       | `true`          |
| `duration`      | `number`                  | Time in milliseconds before auto-hiding.                     | `4000`          |
| `wordHighlight` | `string` \| `string[]`    | A word or array of words to make bold.                       | `null`          |
| `soundEffect`   | `boolean`                 | Plays a subtle sound on notification show.                   | `false`         |
| `vibrate`       | `boolean`                 | Vibrates the device (on supported platforms).                | `false`         |

## 🤝 Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for details on how to submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# Okasan Sushi Website

This project is ready to be hosted on Netlify via GitHub.

## Deployment Steps

1.  **Push to GitHub:**
    *   Create a new repository on GitHub.
    *   Initialize git in this project and push the code to your repository.

2.  **Connect to Netlify:**
    *   Log in to [Netlify](https://www.netlify.com/).
    *   Click **"Add new site"** > **"Import an existing project"**.
    *   Select **GitHub** and choose your repository.

3.  **Configure Build Settings:**
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist`
    *   (These are already configured in `netlify.toml`).

4.  **Set Environment Variables:**
    *   In Netlify, go to **Site settings** > **Environment variables**.
    *   Add the following variables:
        *   `VITE_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name.
        *   `VITE_CLOUDINARY_UPLOAD_PRESET`: Your Cloudinary unsigned upload preset.
        *   `GEMINI_API_KEY`: (Optional) If you use AI features.

5.  **Deploy:**
    *   Netlify will automatically build and deploy your site.

## Admin Access
*   **Login:** Click the "OKASAN" name in the footer.
*   **Credentials:** `sam` / `sam2006`.
*   **Logo Upload:** Click the logo while logged in.
*   **Menu Management:** Use the "Manage Menu" button in the footer while logged in.

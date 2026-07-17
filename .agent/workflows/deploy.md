---
description: How to Deploy Kisan Vikas on Render
---

Follow these step-by-step instructions to deploy your Kisan Vikas full-stack application on Render:

### Phase 1: Prepare Git Repository
1. Initialize git (if not already done) and commit the local changes:
   ```bash
   git init
   git add .
   git commit -m "Configure Kisan Vikas for Render deployment: Forest green themes, case-sensitive logo path casing corrected, and Dynamic Port binding implemented"
   ```
2. Create a new repository on GitHub.
3. Push your local repository to GitHub:
   ```bash
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

### Phase 2: Deploy to Render
1. Log in to [Render Console](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Connect your connected GitHub account and select your `Kisan Vikas` repository.
4. Configure the Web Service Settings:
   - **Name**: `kisan-vikas` (or your preferred service name)
   - **Region**: Select the region closest to you
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Select **Free**

5. Add Environment Variables under **Advanced**:
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `SESSION_SECRET`: `<A Secure Session Key, e.g. a random secret string>`
   - `PORT`: `10000` (Render binds this automatically, but you can explicitly specify it to override)

6. Click **Deploy Web Service**. Render will build the node app and start serving it publicly.

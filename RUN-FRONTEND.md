# Run the frontend locally

**Next.js:** Project uses Next.js **16.1.6**. After pulling, run `yarn install` (close any running dev server first if you get EPERM).

## Quick start

1. Open **PowerShell** or **Command Prompt**.
2. Run:
   ```powershell
   cd h:\GitHub\portifolio
   yarn dev
   ```
3. Wait until you see **Ready** and a line like:
   - `Local: http://localhost:3000`  
   or  
   - `Local: http://localhost:3001` (if 3000 is in use)
4. Open that URL in your browser.

## If port 3000 is in use

Another app is using port 3000. Either:

- Use the port shown in the terminal (e.g. **http://localhost:3001**), or  
- Close the other app using port 3000, then run `yarn dev` again.

## Optional: run via script

From the project root:

```powershell
.\scripts\start-frontend.ps1
```

This runs `yarn dev` and keeps the window open so you can see the URL.

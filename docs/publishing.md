# Publishing

Commit the code and push to the `main` branch. Then run the `Release` workflow to publish the package to npm.

```bash
git commit -m "chore(release): release v0.4.9"
git push origin main
```

Then run the `Release` workflow to publish the package to npm.

```bash
gh workflow run Release
```

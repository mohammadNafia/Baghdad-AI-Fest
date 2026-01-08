# Azure Static Web Apps - Vite 7 to Vite 6 Downgrade Fix

## 🎯 Problem Summary

**Root Cause**: Vite 7.3.0 requires Node >= 20.19.0 OR >= 22.12.0, but Azure Oryx only supports up to Node 20.18.1. This incompatibility caused:
- EBADENGINE warnings
- Vite runtime refusal
- React JSX runtime resolution errors
- Broken dependency resolution

## ✅ Solution Applied

**Downgraded to Vite 6 + Node 18 LTS** - The only 100% Azure-compatible solution.

### Changes Made

1. **Vite & Plugin Downgrade**
   - `vite`: `^7.2.4` → `^6.0.5`
   - `@vitejs/plugin-react`: `^5.1.1` → `^4.3.4`
   - `vitest`: `^4.0.15` → `^3.1.9`
   - `@vitest/ui`: `^4.0.15` → `^3.1.9`

2. **Node Version Lock to 18.20.8**
   - `package.json` engines.node: `18.20.8`
   - `.nvmrc`: `18.20.8`
   - GitHub Actions workflow: `node-version: '18.20.8'`
   - GitHub Actions workflow: `NODE_VERSION: '18.20.8'`

3. **Type Definitions Update**
   - `@types/node`: `^24.10.1` → `^18.20.8`

## 📋 Final Configuration Files

### package.json
```json
{
  "engines": {
    "node": "18.20.8"
  },
  "devDependencies": {
    "vite": "^6.0.5",
    "@vitejs/plugin-react": "^4.3.4",
    "vitest": "^3.1.9",
    "@vitest/ui": "^3.1.9",
    "@types/node": "^18.20.8"
  }
}
```

### .nvmrc
```
18.20.8
```

### vite.config.js
✅ No changes needed - fully compatible with Vite 6

### .github/workflows/azure-static-web-apps-calm-coast-0cd7dff00.yml
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18.20.8'
    check-latest: false

- name: Build And Deploy
  uses: Azure/static-web-apps-deploy@v1
  env:
    NODE_VERSION: '18.20.8'
```

## 🔬 Why This Works

1. **Vite 6 Compatibility**: Vite 6 supports Node >= 18.0.0, making Node 18.20.8 fully compatible
2. **Azure Oryx Support**: Node 18.20.8 is explicitly whitelisted in Oryx supported versions
3. **No Engine Mismatch**: No EBADENGINE warnings since Vite 6 accepts Node 18
4. **Stable LTS**: Node 18.20.8 is a stable LTS release with long-term support

## 🚀 Expected Results

After deployment:
- ✅ Oryx installs Node 18.20.8 (supported version)
- ✅ npm install completes with ZERO EBADENGINE warnings
- ✅ Vite 6 builds successfully
- ✅ React JSX runtime resolves correctly
- ✅ Deployment completes with no errors

## ⚠️ Important Notes

- **DO NOT** upgrade to Vite 7 until Azure Oryx supports Node 20.19+ or 22.12+
- **DO NOT** change Node version without verifying Oryx support
- **KEEP** all version specifications in sync (package.json, .nvmrc, workflow)
- **TEST** locally with Node 18.20.8 before pushing

## 🔮 Future Upgrade Path

Once Azure Oryx supports Node 20.19+ or 22.12+:
1. Update Node to supported version (20.19.1, 20.19.3, 20.19.5, or 22.20.0)
2. Upgrade Vite to 7.x
3. Upgrade @vitejs/plugin-react to 5.x
4. Upgrade vitest to 4.x
5. Update @types/node to match new Node version

## 📚 References

- [Vite 6 Documentation](https://vitejs.dev/)
- [Vite 7 Breaking Changes](https://main.vitejs.dev/blog/announcing-vite7)
- [Azure Oryx Supported Versions](https://github.com/microsoft/Oryx)

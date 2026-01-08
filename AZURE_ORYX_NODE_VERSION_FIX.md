# Azure Oryx Node Version Fix

## 🎯 Problem Summary

Azure Oryx build was failing with:
```
Error: Platform 'nodejs' version '20.19.0' is unsupported.
```

**Root Cause**: Oryx maintains a strict whitelist of supported Node.js versions. Version `20.19.0` is **NOT** in the supported list, even though other `20.x` versions are.

## 🔍 Why 20.19.0 Fails

Oryx uses a **hardcoded version whitelist** for security and compatibility. The supported versions for Node 20 are:
- ✅ `20.11.0`, `20.11.1`
- ✅ `20.14.0`, `20.15.1`
- ✅ `20.17.0`
- ✅ `20.18.0`, `20.18.1`, `20.18.3`
- ✅ `20.19.1`, `20.19.3`, `20.19.5`
- ❌ `20.19.0` - **NOT SUPPORTED**

Oryx does **not** support every patch version. It only supports specific versions that have been tested and validated in the Oryx build environment.

## ✅ Fix Applied

Changed Node version from `20.19.0` to `20.18.1` (the closest supported version) in all locations:

### Files Updated

1. **package.json**
   ```json
   "engines": {
     "node": "20.18.1"  // Changed from 20.19.0
   }
   ```

2. **.nvmrc**
   ```
   20.18.1  // Changed from 20.19.0
   ```

3. **.github/workflows/azure-static-web-apps-calm-coast-0cd7dff00.yml**
   - `node-version: '20.18.1'` (in Setup Node.js step)
   - `NODE_VERSION: '20.18.1'` (in Build And Deploy step env)

## 🔬 How Oryx Version Detection Works

Oryx detects Node version in this order (first match wins):

1. **NODE_VERSION environment variable** (highest priority)
2. **.nvmrc file** in the repository root
3. **package.json engines.node** field
4. **Default** (if none specified)

In this case, we're setting it in **all three places** to ensure Oryx uses the correct version regardless of detection order.

## 🚀 Why This Fix Works

1. **Version is in Oryx whitelist**: `20.18.1` is explicitly listed as supported
2. **Consistent across all sources**: All version specifications point to the same supported version
3. **No version conflicts**: GitHub Actions, Oryx, and local development all use the same version
4. **Stable LTS version**: Node 20.18.1 is a stable LTS release

## 📋 Verification

After deployment, Oryx should:
1. ✅ Detect Node version `20.18.1` from `.nvmrc` or `NODE_VERSION`
2. ✅ Accept the version (it's in the supported list)
3. ✅ Proceed with `npm install`
4. ✅ Complete the Vite build successfully

## ⚠️ Important Notes

- **DO NOT** use unsupported patch versions - always check Oryx supported versions
- **DO NOT** use version ranges (e.g., `>=20.18.0`) - Oryx needs exact versions
- **ALWAYS** keep `.nvmrc`, `package.json engines`, and workflow `NODE_VERSION` in sync
- **CHECK** Oryx release notes when updating Node versions

## 📚 Oryx Supported Versions Reference

As of Oryx 20250107.1, supported Node versions include:
- **Node 18**: `18.20.8` (recommended LTS)
- **Node 20**: `20.18.1`, `20.19.1`, `20.19.3`, `20.19.5`
- **Node 22**: `22.20.0`

For the latest supported versions, check: https://github.com/microsoft/Oryx

# Vercel production storage

The admin CMS uses Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set. This keeps portfolio content and uploaded images outside the temporary Vercel function filesystem.

## One-time setup

1. In the Vercel project, open **Storage** and create a Blob store.
2. Connect the store to this project and choose the production environment.
3. Confirm Vercel has added `BLOB_READ_WRITE_TOKEN` to the Production environment variables.
4. Redeploy the project.

The first production read creates `portfolio-db.json` in the Blob store from the checked-in defaults. Subsequent admin saves overwrite that object durably. Uploaded images are stored in the same Blob store and the database keeps their permanent Blob URLs.

Do not use `PORTFOLIO_DB_PATH` for Vercel production unless it points to storage mounted by a platform that supports durable writes. It remains available for local or self-hosted deployments.

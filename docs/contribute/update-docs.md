# Update docs

## Where docs live

- Docs content: `docs/`
- MkDocs config/nav/theme: `mkdocs.yml`

## Preview locally

From the repo root, run MkDocs in dev mode:

```sh
mkdocs serve
```
??? note "Install MkDocs (one-time)"
    ```sh
    pip install mkdocs-material
    ```

## Tips

- Keep pages short and actionable.
- When you change behavior (setup, services, admin panel endpoints), update the docs in the same PR.
- If you add a new page, also add it to the `nav` in `mkdocs.yml`.

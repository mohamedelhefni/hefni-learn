@AGENTS.md

## Content structure

Namespace-based. Each topic is a directory under `src/data/`:

```
src/data/
  kubepath/          # Kubernetes tutorial
    07-pod-yaml-anatomy.yaml
    ...
  <other-topic>/     # Add new topics here
    01-intro.yaml
    ...
```

### Routes

| URL | Description |
|-----|-------------|
| `/` | Home — lists all namespaces (topic cards) |
| `/[namespace]` | Namespace page — lists chapters for that topic |
| `/[namespace]/chapter/[id]` | Chapter page |
| `/api/[namespace]/chapters/[id]` | JSON API for a chapter |

### Content loader (`src/lib/yaml-loader.ts`)

- `listNamespaces()` — lists all directories under `src/data/`
- `getAllChapters(namespace)` — list of chapters for a namespace
- `getChapter(namespace, id)` — load a single chapter YAML

### Adding a new topic

1. Create `src/data/<topic>/`
2. Add numbered YAML files: `01-title.yaml`, `02-title.yaml`, …
3. Each YAML follows the `ChapterData` schema (`src/lib/types.ts`)
4. The topic appears automatically on the home page

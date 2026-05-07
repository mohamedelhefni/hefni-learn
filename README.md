# hefni·learn

Interactive Kubernetes learning — hands-on practice, broken manifests to debug, and quizzes that actually stick.

## What it is

hefni·learn is a self-paced Kubernetes tutorial platform built with Next.js. Each chapter is structured around four activities:

- **Concepts** — clear explanations of what you're learning and why
- **Command Practice** — run `kubectl` commands in a simulated terminal
- **Scenarios** — debug broken configurations with progressive hints
- **Quiz** — multiple choice, true/false, YAML fill-in, and command challenges

## Topics covered

38 chapters spanning the full Kubernetes curriculum:

- Kubernetes basics and cluster architecture
- Pods, multi-container pods, and debugging
- Labels, selectors, and annotations
- Namespaces, deployments, scaling, and rollbacks
- Services, Ingress, and network policies
- ConfigMaps, Secrets, and resource management
- ServiceAccounts, RBAC, security contexts, and admission control
- Volumes, PersistentVolumes, and storage classes
- Jobs, CronJobs, and deployment strategies
- Helm, health probes, monitoring, logging
- API deprecations and CRDs

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start learning.

## Project structure

```
src/
├── app/                  # Next.js app router pages
├── components/           # UI and chapter components
├── data/kubepath/        # 38 YAML lesson files
└── lib/                  # Data loading and progress utilities
```

Lesson content lives in `src/data/kubepath/` as YAML files. Each file defines a chapter's concepts, commands, scenarios, and quiz questions.

## Acknowledgements

Lesson content is derived from [nithin-nk/kubepath](https://github.com/nithin-nk/kubepath), which is an excellent open Kubernetes curriculum. Huge thanks to [@nithin-nk](https://github.com/nithin-nk) for putting it together and releasing it under Apache 2.0 — this project wouldn't exist without it.

The original work is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). See `LICENSE` for details.

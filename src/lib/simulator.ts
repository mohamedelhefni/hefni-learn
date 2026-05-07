import type { CommandPractice, SimResult, Validation } from "./types";

// Normalize command: collapse whitespace, trim
function normalize(cmd: string): string {
  return cmd.trim().replace(/\s+/g, " ").toLowerCase();
}

// Known command output fixtures
const COMMAND_FIXTURES: Array<{
  match: (cmd: string) => boolean;
  output: string;
}> = [
  {
    match: (cmd) =>
      /kubectl\s+run\s+\S+\s+--image=\S+/.test(cmd),
    output: `pod/yaml-test created`,
  },
  {
    match: (cmd) =>
      /kubectl\s+(get\s+pod|get\s+po)\s+\S+\s+-o\s+yaml/.test(cmd) ||
      /kubectl\s+(get\s+pod|get\s+po)\s+-o\s+yaml/.test(cmd),
    output: `apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: "2024-01-01T00:00:00Z"
  name: yaml-test
  namespace: default
  resourceVersion: "12345"
  uid: abc-123-def-456
spec:
  containers:
  - image: nginx
    name: yaml-test
    resources: {}
    terminationMessagePath: /dev/termination-log
    terminationMessagePolicy: File
  dnsPolicy: ClusterFirst
  restartPolicy: Always
  schedulerName: default-scheduler
  terminationGracePeriodSeconds: 30
status:
  phase: Running
  podIP: 10.0.0.1
  conditions:
  - lastTransitionTime: "2024-01-01T00:00:00Z"
    status: "True"
    type: Ready`,
  },
  {
    match: (cmd) =>
      /kubectl\s+api-resources.*grep.*deploy/i.test(cmd) ||
      /kubectl\s+api-resources.*\|\s*grep\s+-i\s+deploy/i.test(cmd),
    output: `NAME                  SHORTNAMES   APIVERSION             NAMESPACED   KIND
deployments           deploy       apps/v1                true         Deployment`,
  },
  {
    match: (cmd) =>
      /kubectl\s+api-resources.*grep.*pod/i.test(cmd) ||
      /kubectl\s+api-resources.*\|\s*grep\s+-i\s+pod/i.test(cmd),
    output: `NAME                  SHORTNAMES   APIVERSION   NAMESPACED   KIND
pods                  po           v1           true         Pod`,
  },
  {
    match: (cmd) =>
      /kubectl\s+api-resources$/.test(cmd),
    output: `NAME                              SHORTNAMES   APIVERSION                             NAMESPACED   KIND
bindings                                       v1                                     true         Binding
configmaps                        cm           v1                                     true         ConfigMap
endpoints                         ep           v1                                     true         Endpoints
events                            ev           v1                                     true         Event
namespaces                        ns           v1                                     false        Namespace
nodes                             no           v1                                     false        Node
pods                              po           v1                                     true         Pod
services                          svc          v1                                     true         Service
deployments                       deploy       apps/v1                                true         Deployment
replicasets                       rs           apps/v1                                true         ReplicaSet
statefulsets                      sts          apps/v1                                true         StatefulSet
ingresses                         ing          networking.k8s.io/v1                   true         Ingress
cronjobs                          cj           batch/v1                               true         CronJob
jobs                                           batch/v1                               true         Job`,
  },
  {
    match: (cmd) =>
      /kubectl\s+explain\s+pod\.spec\.containers/.test(cmd),
    output: `KIND:     Pod
VERSION:  v1

RESOURCE: containers <[]Object>

DESCRIPTION:
     List of containers belonging to the pod.

FIELDS:
   args <[]string>
     Arguments to the entrypoint.

   command <[]string>
     Entrypoint array.

   env <[]Object>
     List of environment variables to set in the container.

   image <string>
     Docker image name. Required.

   imagePullPolicy <string>
     Image pull policy. One of Always, Never, IfNotPresent.

   name <string> -required-
     Name of the container as a DNS_LABEL. Must be unique within a pod.

   ports <[]Object>
     List of ports to expose from the container.

   resources <Object>
     Compute Resources required by this container.`,
  },
  {
    match: (cmd) =>
      /kubectl\s+explain\s+pods?/.test(cmd),
    output: `KIND:     Pod
VERSION:  v1

DESCRIPTION:
     Pod is a collection of containers that can run on a host.

FIELDS:
   apiVersion <string>
     APIVersion defines the versioned schema of this representation of an object.

   kind <string>
     Kind is a string value representing the REST resource this object represents.

   metadata <Object>
     Standard object's metadata.

   spec <Object>
     Specification of the desired behavior of the pod.

   status <Object>
     Most recently observed status of the pod.`,
  },
  {
    match: (cmd) =>
      /kubectl\s+(get\s+pods?|get\s+po)$/.test(cmd) ||
      /kubectl\s+(get\s+pods?|get\s+po)\s+-n\s+default/.test(cmd),
    output: `NAME        READY   STATUS    RESTARTS   AGE
yaml-test   1/1     Running   0          2m`,
  },
  {
    match: (cmd) =>
      /kubectl\s+(get\s+pods?|get\s+po)\s+(-A|--all-namespaces)/.test(cmd),
    output: `NAMESPACE     NAME                     READY   STATUS    RESTARTS   AGE
default       yaml-test                1/1     Running   0          2m
kube-system   coredns-xxx              1/1     Running   0          1h`,
  },
  {
    match: (cmd) =>
      /kubectl\s+cluster-info/.test(cmd),
    output: `Kubernetes control plane is running at https://127.0.0.1:6443
CoreDNS is running at https://127.0.0.1:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy`,
  },
  {
    match: (cmd) =>
      /kubectl\s+describe\s+pod\s+\S+/.test(cmd),
    output: `Name:         yaml-test
Namespace:    default
Status:       Running
IP:           10.0.0.1
Containers:
  yaml-test:
    Image:          nginx
    Port:           <none>
    State:          Running
Conditions:
  Type              Status
  Ready             True
Events:
  Normal  Scheduled  2m  default-scheduler  Successfully assigned default/yaml-test
  Normal  Pulled     2m  kubelet            Successfully pulled image "nginx"
  Normal  Created    2m  kubelet            Created container yaml-test
  Normal  Started    2m  kubelet            Started container yaml-test`,
  },
];

export function simulateCommand(cmd: string): string {
  const norm = normalize(cmd);

  for (const fixture of COMMAND_FIXTURES) {
    if (fixture.match(norm)) {
      return fixture.output;
    }
  }

  // Unknown command fallback
  if (norm.startsWith("kubectl ")) {
    return `Error from server (NotFound): the server could not find the requested resource
(use -v flag to get full output)`;
  }

  if (norm.includes("|")) {
    // Piped command - try to simulate based on the first part
    const parts = cmd.split("|");
    const firstPart = parts[0].trim();
    const result = simulateCommand(firstPart);

    const grepPart = parts.find((p) => p.trim().startsWith("grep"));
    if (grepPart && result) {
      const grepArg = grepPart.trim().replace(/^grep\s+(-i\s+)?/, "");
      const pattern = new RegExp(grepArg.replace(/"/g, ""), "i");
      const lines = result.split("\n").filter((line) => pattern.test(line));
      return lines.join("\n") || "(no matches)";
    }
    return result;
  }

  return `command not found: ${cmd.split(" ")[0]}`;
}

/**
 * Validate a user-typed command against the exercise's validation rule.
 *
 * Strategy: compare the typed command against validation.command directly
 * (normalized, whitespace-collapsed, lowercased).  The user's command must
 * start with all the tokens of the expected command, so extra trailing args
 * (e.g. a node name after "kubectl describe node") still pass.
 */
export function validateCommand(userCmd: string, validation: Validation): boolean {
  const expected = validation.command;
  if (!expected) return false;

  const normUser = normalize(userCmd);
  const normExpected = normalize(expected);

  // User's command starts with the expected command tokens
  // e.g. "kubectl describe node minikube" passes "kubectl describe node"
  return normUser === normExpected || normUser.startsWith(normExpected + " ");
}

/** @deprecated Use validateCommand instead */
export function validateOutput(output: string, validation: Validation): boolean {
  if (!output) return false;
  if (validation.expected_contains) {
    if (!output.includes(validation.expected_contains)) return false;
  }
  if (validation.expected_not_contains) {
    if (output.includes(validation.expected_not_contains)) return false;
  }
  return true;
}

export function runExercise(
  cmd: string,
  exercise: CommandPractice
): SimResult {
  const output = simulateCommand(cmd);
  const success = validateOutput(output, exercise.validation);
  return {
    output,
    success,
    points: success ? exercise.points : 0,
  };
}

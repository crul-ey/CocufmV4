// In je hooks/use-toast.ts bestand

"use client";

import * as React from "react";

// --- VERBETERING 1: Type-veilige Actions definiëren ---
const ACTION_TYPES = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

type Action =
  | { type: typeof ACTION_TYPES.ADD_TOAST; toast: Toast }
  | { type: typeof ACTION_TYPES.UPDATE_TOAST; toast: Partial<Toast> & { id: string } }
  | { type: typeof ACTION_TYPES.DISMISS_TOAST; toastId?: Toast["id"] }
  | { type: typeof ACTION_TYPES.REMOVE_TOAST; toastId?: Toast["id"] };

// --- Einde Verbetering 1 ---

type ToastProps = {
  title?: React.ReactNode; // ReactNode toestaat voor meer flexibiliteit
  description?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
  duration?: number;
};

type ToastActionElement = React.ReactElement;

type Toast = ToastProps & {
  id: string;
  action?: ToastActionElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 5000;

type State = {
  toasts: Toast[];
};

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string, customDuration?: number) => {
  if (toastTimeouts.has(toastId)) {
    // Verwijder bestaande timer als die er is, voor de zekerheid
    clearTimeout(toastTimeouts.get(toastId));
  }

  const delay = customDuration || TOAST_REMOVE_DELAY;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: ACTION_TYPES.REMOVE_TOAST,
      toastId: toastId,
    });
  }, delay);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPES.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case ACTION_TYPES.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case ACTION_TYPES.DISMISS_TOAST: {
      const { toastId } = action;

      // --- VERBETERING 2: Robuuster Timeout Beheer ---
      // Bij het handmatig dismessen, start de remove timer.
      // Dit zorgt voor een consistente ervaring.
      if (toastId) {
        addToRemoveQueue(toastId, 500); // Korte delay voor de animatie
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id, 500);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            // eslint-disable-next-line no-mixed-spaces-and-tabs
            : t
        ),
      };
    }
    case ACTION_TYPES.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) { // Nu met het correcte Action type
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type ToastInput = Omit<ToastProps, "id"> & {
    duration?: number;
};

function toast(props: ToastInput) {
  const id = crypto.randomUUID(); // Modernere manier voor unieke ID

  const update = (props: Partial<ToastInput>) =>
    dispatch({
      type: ACTION_TYPES.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () => dispatch({ type: ACTION_TYPES.DISMISS_TOAST, toastId: id });

  dispatch({
    type: ACTION_TYPES.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss();
      },
    },
  });

  // Auto-dismiss met custom of default duration
  addToRemoveQueue(id, props.duration);

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: ACTION_TYPES.DISMISS_TOAST, toastId }),
  };
}

export { useToast, toast };
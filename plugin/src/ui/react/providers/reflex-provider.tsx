import type { UseProducerHook, UseSelectorHook } from "@rbxts/react-reflex";
import { useProducer, useSelector } from "@rbxts/react-reflex";

import type { RootStore } from "store";

export const useRootSelector: UseSelectorHook<RootStore> = useSelector;
export const useRootProducer: UseProducerHook<RootStore> = useProducer;

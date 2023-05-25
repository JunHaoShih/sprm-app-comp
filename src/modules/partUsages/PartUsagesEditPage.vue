<template>
  <div class="q-pa-sm">
    <!-- splitter area -->
    <q-splitter
      v-model="splitterModel"
      class="outer-max"
    >
      <template v-slot:before>
        <PartUsageTreePanel
          class="q-pa-md q-gutter-sm"
          :id="Number(props.id)"
          v-model:selectedNode="selectedNode"
        >
          <template v-slot:before>
            <q-btn
              color="primary"
              :label="$t('actions.adds.newPart')"
              @click="createPrompt = true"
            />
            <q-btn
              color="primary"
              :label="$t('actions.adds.existingPart')"
              @click="searchPrompt = true"
            />
            <q-btn color="primary" :label="$t('actions.delete')"></q-btn>
          </template>
        </PartUsageTreePanel>
      </template>

      <template v-slot:after>
        <div class="q-gutter-sm">
          <PartUsageRightPanel
            :id="selectedParentId"
            :readonly="false"
          />
        </div>
      </template>
    </q-splitter>
    <CreatePartUsageAndPartDialog
      v-model="createPrompt"
      :selectedPartVersionId="selectedParentId"
    />
    <CreatePartUsageDialog
      v-model="searchPrompt"
      :selectedPartVersionId="selectedParentId"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import PartUsageRightPanel from './components/PartUsageRightPanel.vue';
import PartUsageTreePanel from './components/PartUsageTreePanel.vue';
import CreatePartUsageAndPartDialog from './components/CreatePartUsageAndPartDialog.vue';
import CreatePartUsageDialog from './components/CreatePartUsageDialog.vue';
import 'src/extensions/date.extensions';
import { BomTreeNode } from './stores/BomTreeStore';

const splitterModel = ref(50);

const createPrompt = ref(false);

const searchPrompt = ref(false);

const selectedNode = ref<BomTreeNode>({} as BomTreeNode);

const selectedParentId = computed(
  (): number => {
    if (Object.keys(selectedNode).length === 0) {
      return 0;
    }
    return selectedNode.value.versionId;
  },
);

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 190px)
</style>
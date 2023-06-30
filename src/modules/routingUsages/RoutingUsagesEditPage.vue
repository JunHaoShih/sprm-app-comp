<template>
  <div class="q-px-sm">
    <q-separator />
    <!-- splitter area -->
    <q-splitter
      v-model="splitterModel"
      class="outer-max"
    >
      <template v-slot:before>
        <RoutingUsagesTreePanel
          class="q-pa-md q-gutter-xs"
          :id="Number(props.id)"
          v-model:selected-node="selectedNode"
        >
          <template v-slot:before>
            <q-btn
              class="action-btn"
              :label="$t('actions.adds.existingProcess')"
              @click="searchPrompt = true"
            />
            <q-btn
              class="action-btn"
              :label="$t('actions.delete')"
              @click="onDeleteButtonClicked"
              :disable="selectedNode.usageId === null"
            />
          </template>
        </RoutingUsagesTreePanel>
      </template>

      <template v-slot:after>
        {{ 456 }}
      </template>
    </q-splitter>
    <CreateRoutingUsageDialog
      v-model="searchPrompt"
      :rootVersionId="rootVersionId"
      :selected-parent-usage-id="parentUsageId"
    ></CreateRoutingUsageDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import 'src/extensions/date.extensions';
import RoutingUsagesTreePanel from './components/RoutingUsagesTreePanel.vue';
import { RoutingUsageTreeNode } from './stores/RoutingUsagesMapStore';
import CreateRoutingUsageDialog from './components/CreateRoutingUsageDialog.vue';

const splitterModel = ref(50);

const searchPrompt = ref(false);

const selectedNode = ref<RoutingUsageTreeNode>({} as RoutingUsageTreeNode);

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

const rootVersionId = computed(
  () => Number(props.id),
);

const parentUsageId = computed(
  () => selectedNode.value.usageId ?? null,
);

async function onDeleteButtonClicked() {
  console.log(`Root version id: ${rootVersionId.value}`);
  console.log(`Parent usage id: ${parentUsageId.value}`);
  /* const success = await partUsageService.remove(selectedNode.value.usageId);
  if (success) {
    partUsaeChildrenStore.deleteUses(
      selectedNode.value.parentId,
      selectedNode.value.versionId,
    );
    $q.notify({
      message: i18n.t('actions.deletes.success'),
      color: 'secondary',
      icon: 'check_circle',
    });
  } */
}
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 190px)
</style>

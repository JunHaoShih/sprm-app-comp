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
        <div class="q-gutter-sm">
          <RoutibgUsagesRightPanel
            :selected-node="selectedNode"
            :readonly="false"
          >
          </RoutibgUsagesRightPanel>
        </div>
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
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import 'src/extensions/date.extensions';
import RoutingUsagesTreePanel from '../../../../../modules/routingUsages/components/RoutingUsagesTreePanel.vue';
import RoutibgUsagesRightPanel from '../../../../../modules/routingUsages/components/RoutingUsagesRightPanel.vue';
import { RoutingUsageTreeNode, useRoutingUsagesMapStore } from '../../../../../modules/routingUsages/stores/RoutingUsagesMapStore';
import CreateRoutingUsageDialog from '../../../../../modules/routingUsages/components/CreateRoutingUsageDialog.vue';
import { routingUsageService } from '../../../../../modules/routingUsages/services/RoutingUsageService';

const $q = useQuasar();

const i18n = useI18n();

const routingUsagesMapStore = useRoutingUsagesMapStore();

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
  const targetUsageId = selectedNode.value.usageId;
  if (targetUsageId) {
    const success = await routingUsageService.remove(targetUsageId);
    if (success) {
      routingUsagesMapStore.deleteUses(
        selectedNode.value.parentUsageId,
        targetUsageId,
      );
      $q.notify({
        message: i18n.t('actions.deletes.success'),
        color: 'secondary',
        icon: 'check_circle',
      });
    }
  }
}
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 225px)
</style>

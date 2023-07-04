<template>
  <div class="q-px-sm">
    <q-separator />
    <!-- splitter area -->
    <q-splitter
      v-model="splitterModel"
      class="outer-max"
    >
      <template v-slot:before>
        <PartUsageTreePanel
          class="q-pa-md q-gutter-xs"
          :id="Number(props.id)"
          v-model:selectedNode="selectedNode"
          :is-edit="true"
        >
          <template v-slot:before>
            <q-btn
              class="action-btn"
              :label="$t('actions.adds.newPart')"
              @click="createPrompt = true"
              :disable="!selectedNode.checkout"
            />
            <q-btn
              class="action-btn"
              :label="$t('actions.adds.existingPart')"
              @click="searchPrompt = true"
              :disable="!selectedNode.checkout"
            />
            <q-btn
              class="action-btn"
              :label="$t('actions.delete')"
              @click="onDeleteButtonClicked"
              :disable="selectedNode.usageId <= 0"
            />
          </template>
          <!-- add context menu items -->
          <template v-slot:contex-menu="prop">
            <q-item
              v-if="canCheckIn(prop.node as BomTreeNode)"
              clickable
              v-close-popup
            >
              <q-item-section
                @click="onCheckInClicked((prop.node as BomTreeNode).childId)"
              >
                <div>
                  <q-icon name="south_east" color="secondary"/>
                  {{ $t('actions.checkin') }}
                </div>
              </q-item-section>
            </q-item>
            <q-item
              v-if="canCheckOut(prop.node as BomTreeNode)"
              clickable
              v-close-popup
            >
              <q-item-section
                @click="onCheckOutClicked((prop.node as BomTreeNode).childId)"
              >
                <div>
                  <q-icon name="south_east" color="red"/>
                  {{ $t('actions.checkout') }}
                </div>
              </q-item-section>
            </q-item>
          </template>
        </PartUsageTreePanel>
      </template>

      <template v-slot:after>
        <div class="q-gutter-sm">
          <PartUsageRightPanel
            :id="selectedParentId"
            :readonly="!isSelectedNodeCheckout"
          />
        </div>
      </template>
    </q-splitter>
    <CreatePartUsageDialog
      v-model="createPrompt"
      :selectedPartVersionId="selectedParentId"
      createType="create"
    />
    <CreatePartUsageDialog
      v-model="searchPrompt"
      :selectedPartVersionId="selectedParentId"
      createType="search"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { partService } from 'src/modules/parts/services/PartService';
import PartUsageRightPanel from './components/PartUsageRightPanel.vue';
import PartUsageTreePanel from './components/PartUsageTreePanel.vue';
import CreatePartUsageDialog from './components/CreatePartUsageDialog.vue';
import 'src/extensions/date.extensions';
import { partUsageService } from './services/PartUsageService';
import { BomTreeNode } from './stores/BomTreeStore';
import { usePartUsageTreeStore } from './stores/PartUsageUsesStore';

const $q = useQuasar();

const i18n = useI18n();

const partUsaeChildrenStore = usePartUsageTreeStore();

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

const isSelectedNodeCheckout = computed(
  (): boolean => selectedNode.value.checkout,
);

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

async function onDeleteButtonClicked() {
  const success = await partUsageService.remove(selectedNode.value.usageId);
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
  }
}

async function onCheckInClicked(partId: number): Promise<void> {
  const checkinPart = await partService.checkIn(partId);
  if (checkinPart) {
    partUsaeChildrenStore.setPart(checkinPart);
    const uses = await partUsageService.getByParentVersionId(checkinPart.version.id);
    if (uses) {
      partUsaeChildrenStore.addUses(uses, checkinPart.version.id);
    }
  }
}

async function onCheckOutClicked(partId: number): Promise<void> {
  const checkoutPart = await partService.checkOut(partId);
  if (checkoutPart) {
    partUsaeChildrenStore.setPart(checkoutPart);
    const uses = await partUsageService.getByParentVersionId(checkoutPart.version.id);
    if (uses) {
      partUsaeChildrenStore.addUses(uses, checkoutPart.version.id);
    }
  }
}

function canCheckIn(node: BomTreeNode): boolean {
  return node.checkout && node.usageId > 0;
}

function canCheckOut(node: BomTreeNode): boolean {
  return !node.checkout && node.usageId > 0;
}
</script>

<style lang="sass" scoped>
.outer-max
  height: calc(100vh - 190px)
</style>

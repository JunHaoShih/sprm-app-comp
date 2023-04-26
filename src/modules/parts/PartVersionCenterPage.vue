<template>
  <div class="main-panel">
    <q-banner
      class="bg-primary text-white q-ma-sm"
      style="border-radius: 10px"
    >
      <div class="text-h6 row">
        <div>{{ partVersionStore.content.master.number }}</div>
        <div>
          [{{ partVersionStore.content.version }}]
        </div>
        <div v-if="partVersionStore.content.master.viewType === ViewType.Design">
          [{{ $t('parts.views.design') }}]
        </div>
        <div v-else>
          [{{ $t('parts.views.manufacturing') }}]
        </div>
        <div class="q-ml-sm">
          <q-icon v-if="part.checkout" name="warning" color="orange" size="8px">
            <q-tooltip>
              {{ $t('iterable.checkout') }}
            </q-tooltip>
          </q-icon>
        </div>
      </div>
    </q-banner>
    <q-tabs
      align="left"
      indicator-color="orange"
      class="tabs-font"
    >
      <q-route-tab
        :label="$t('parts.info')"
        :to="'/parts/version/' + id + '/info'"
        exact
      />
      <q-route-tab
        :label="$t('parts.bom')"
        :to="'/parts/version/' + id + '/usages'"
        exact
      />
    </q-tabs>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { partService } from './services/PartService';
import { useAttributeLinksStore } from '../customs/stores/AttributeLinksStore';
import { usePartVersionStore } from './stores/PartVersionStore';
import { Part, ViewType } from './models/Part';
import 'src/extensions/date.extensions';
import { ObjectTypeId } from '../objectTypes/models/ObjectType';

const attrLinksStore = useAttributeLinksStore();

const partVersionStore = usePartVersionStore();

const part = ref<Part>({} as Part);

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

async function updatePartAndVersion(partVersionId: number) {
  await partVersionStore.partVersionInit(partVersionId);
  const targetPart = await partService.getById(Number(partVersionStore.partVersion.master.id));
  if (targetPart) {
    part.value = targetPart;
  }
}

watch(() => props.id, async (newValue) => {
  await updatePartAndVersion(Number(newValue));
});

onBeforeMount(async () => {
  partVersionStore.content.customValues = Object.fromEntries(attrLinksStore.content.attributes.map((attr) => [attr.number, '']));
  attrLinksStore.initialize(ObjectTypeId.PartVersion);
  await updatePartAndVersion(Number(props.id));
});
</script>

<style lang="sass" scoped>
.tabs-font
  font-family: 'Noto Sans TC'
</style>

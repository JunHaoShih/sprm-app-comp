<template>
  <div class="main-panel">
    <q-banner
      class="bg-primary text-white q-ma-sm"
      style="border-radius: 10px"
    >
      <div class="text-h6 row">
        <div>{{ partVersion.master.number }}</div>
        <div>
          [{{ partVersion.version }}]
        </div>
        <div v-if="partVersion.master.viewType === ViewType.Design">
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
        :to="'/parts/' + id + '/info'"
        exact
      />
    </q-tabs>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { partService } from './services/PartService';
import { partVersionService } from './services/PartVersionService';
import { useAttributeLinksStore } from '../customs/stores/AttributeLinksStore';
import { Part, ViewType } from './models/Part';
import { PartMaster, PartVersion } from './models/PartVersion';
import { ObjectTypeId } from '../objectTypes/models/ObjectType';
import 'src/extensions/date.extensions';

const router = useRouter();

const attrLinksStore = useAttributeLinksStore();

const part = ref<Part>({} as Part);

const partVersion = ref<PartVersion>({
  id: 0,
  version: 0,
  checkout: false,
  master: {} as PartMaster,
  customValues: {} as Record<string, string>,
  createUser: '',
  createDate: new Date(),
  updateUser: '',
  updateDate: new Date(),
  remarks: '',
});

const props = withDefaults(defineProps<{
  id: string,
}>(), {
  id: '',
});

onBeforeMount(async () => {
  attrLinksStore.initialize(ObjectTypeId.PartVersion);
  const targetPart = await partService.getById(Number(props.id));
  if (targetPart) {
    part.value = targetPart;
    if (!targetPart.checkoutId) {
      router.push('/parts');
    }
    const targetVersion = await partVersionService.getById(Number(targetPart.checkoutId));
    if (targetVersion) {
      partVersion.value = targetVersion;
    }
  }
});
</script>

<style lang="sass" scoped>
.tabs-font
  font-family: 'Noto Sans TC'
</style>

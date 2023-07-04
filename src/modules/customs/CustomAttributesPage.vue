<template>
  <div class="main-panel">
    <div class="row q-pa-md q-gutter-xs">
      <q-btn
        class="action-btn"
        :label="$t('actions.add')"
        @click="onAddClicked"
      />
      <q-btn
        class="action-btn"
        :label="$t('actions.delete')"
        @click="onDeleteClicked"
      />
      <q-space/>
      <q-input
        dense
        v-model="patternInput"
        :label="$t('actions.search')"
        v-on:keyup.enter="onSearch"
      ></q-input>
    </div>
    <q-splitter
      v-model="splitterModel"
      unit="px"
      class="outer-max"
    >
      <template v-slot:before>
        <div class="q-pa-md">
          <q-scroll-area
            visible
            class="scroll-max"
          >
            <q-list bordered padding class="rounded-borders text-black">
              <q-item
                v-for="attr in attributes"
                :key="attr.id"
                clickable
                v-ripple
                :active="defaultAttr.id === attr.id"
                @click="defaultAttr = attr"
                active-class="bg-secondary text-white"
              >
                <q-item-section avatar>
                  <q-avatar class="avatar-color" text-color="white">{{ attr.name[0] }}</q-avatar>
                </q-item-section>

                <q-item-section>
                  {{ attr.number }} {{ attr.name }} [{{ attr.languages[i18n.locale.value] }}]
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
      </template>

      <template v-slot:after>
        <CustomAttributeEditPanel
          v-if="defaultAttr && Object.entries(defaultAttr).length > 0 && defaultAttr.id > 0"
          v-model="defaultAttr"
          class="q-pa-md">
        </CustomAttributeEditPanel>
      </template>

    </q-splitter>
    <CustomAttributeAddDialog v-model="dialogPrompt"></CustomAttributeAddDialog>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import CustomAttributeEditPanel from './components/CustomAttributeEditPanel.vue';
import CustomAttributeAddDialog from './components/CustomAttributeAddDialog.vue';
import { useCustomAttributesStore } from './stores/CustomAttributesStore';
import { AttributeType, CustomAttribute, DisplayType } from './models/CustomAttribute';
import { customAttributeService } from './services/CustomAttributeService';

const i18n = useI18n();

const $q = useQuasar();

const customAttributesStore = useCustomAttributesStore();

const defaultAttr = ref<CustomAttribute>({} as CustomAttribute);

const splitterModel = ref(350);

const pattern = ref('');

const patternInput = ref('');

const dialogPrompt = ref(false);

const attributes = computed(
  () => customAttributesStore.filteredAttributes(pattern.value),
);

function onSearch(): void {
  pattern.value = patternInput.value;
}

function onAddClicked(): void {
  dialogPrompt.value = true;
}

function onDeleteClicked(): void {
  if (!defaultAttr.value || Object.entries(defaultAttr.value).length === 0) {
    $q.notify({
      message: `${i18n.t('actions.deletes.atLeastOne')}`,
      color: 'red',
      icon: 'error',
    });
    return;
  }
  $q.dialog({
    title: 'Confirm',
    message: `${i18n.t('actions.deletes.confirm')} ${defaultAttr.value.number}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const code = await customAttributeService.remove(defaultAttr.value.id);
    if (code === 0) {
      $q.notify({
        message: `${defaultAttr.value.number}: ${i18n.t('actions.deletes.success')}`,
        color: 'secondary',
        icon: 'check_circle',
      });
      customAttributesStore.removeAttribute(defaultAttr.value.id);
    }
  });
}

watch(() => attributes.value.length, () => {
  const firstAttr = attributes.value[0];
  if (firstAttr) {
    defaultAttr.value = firstAttr;
  }
});

onBeforeMount(async () => {
  defaultAttr.value = {
    id: -1,
    attributeType: AttributeType.String,
    displayType: DisplayType.Value,
    isDisabled: false,
    options: [],
    number: '',
    name: '',
    isSystemDefault: false,
    languages: {} as Record<string, string>,
    createUser: '',
    createDate: new Date(),
    updateUser: '',
    updateDate: new Date(),
    remarks: '',
  };
  await customAttributesStore.initialize();
  const firstAttr = attributes.value[0];
  if (firstAttr) {
    defaultAttr.value = firstAttr;
  }
});
</script>

<style lang="sass">
.highlight-menu
  color: white
  background: #026E81

.outer-max
  height: calc(100vh - 180px)

.scroll-max
  height: calc(100vh - 215px)

.avatar-color
  background: #FF9933
</style>

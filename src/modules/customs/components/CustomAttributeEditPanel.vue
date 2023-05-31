<template>
  <div>
    <!-- info area -->
    <CustomAttributePanel
      v-model="defaultAttr"
      :on-submit="editAttribute"
      :readonly="readonly"
    >
      <template v-slot:before>
        <!-- action bar -->
        <div class="row shadow-1 q-mb-sm q-pa-sm"
          style="border-radius: 10px"
        >
          <q-btn v-if="readonly" dense round flat color="grey" icon="edit"
            @click="readonly = !readonly"
          />
          <div v-else class="row">
            <q-btn dense round flat color="red" icon="close"
              class="bg-grey-4 q-mr-sm"
              @click="onCancelClicked"
            />
            <q-btn dense round flat color="green" icon="done"
              class="bg-grey-4"
              type="submit"
            />
          </div>
          <q-space/>
          <div class="q-ma-sm">
            Last edited: {{ new Date(defaultAttr.updateDate).getDateStr() }}
            <q-tooltip>
              <div>{{ new Date(defaultAttr.updateDate).toString() }}</div>
              <div>By {{ defaultAttr.updateUser }}</div>
            </q-tooltip>
          </div>
        </div>
      </template>
    </CustomAttributePanel>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import CustomAttributePanel from './CustomAttributePanel.vue';
import { CustomAttribute } from '../models/CustomAttribute';
import { customAttributeService } from '../services/CustomAttributeService';
import 'src/extensions/date.extensions';

const i18n = useI18n();

const $q = useQuasar();

const props = defineProps<{
  modelValue: CustomAttribute,
}>();

type Emit = {
  (e: 'update:modelValue', value: CustomAttribute): void
}
const emit = defineEmits<Emit>();

const inputAttr = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const defaultAttr = ref<CustomAttribute>({} as CustomAttribute);

const readonly = ref(true);

function initialize(): void {
  readonly.value = true;
  defaultAttr.value = JSON.parse(JSON.stringify(inputAttr.value));
}

watch(() => inputAttr.value.id, () => {
  initialize();
});

function onCancelClicked(): void {
  initialize();
}

async function editAttribute(): Promise<void> {
  const code = await customAttributeService.update(defaultAttr.value.id, {
    number: defaultAttr.value.number,
    name: defaultAttr.value.name,
    attributeType: defaultAttr.value.attributeType,
    displayType: defaultAttr.value.displayType,
    isDisabled: defaultAttr.value.isDisabled,
    languages: defaultAttr.value.languages,
    options: defaultAttr.value.options,
    remarks: defaultAttr.value.remarks,
  });

  if (code === 0) {
    inputAttr.value.number = defaultAttr.value.number;
    inputAttr.value.name = defaultAttr.value.name;
    inputAttr.value.remarks = defaultAttr.value.remarks;
    inputAttr.value.languages = defaultAttr.value.languages;
    inputAttr.value.options = defaultAttr.value.options;
    inputAttr.value.isDisabled = defaultAttr.value.isDisabled;
    inputAttr.value.createUser = defaultAttr.value.createUser;
    inputAttr.value.updateUser = defaultAttr.value.updateUser;
    inputAttr.value.createDate = defaultAttr.value.createDate;
    inputAttr.value.updateDate = defaultAttr.value.updateDate;
    readonly.value = true;
    $q.notify({
      message: `${inputAttr.value.number}: ${i18n.t('actions.updates.success')}`,
      color: 'secondary',
      icon: 'check_circle',
    });
  }
}

onBeforeMount(() => {
  initialize();
});
</script>

<style lang="sass" scoped>
.expandable
  font-family: 'Noto Sans TC'
</style>

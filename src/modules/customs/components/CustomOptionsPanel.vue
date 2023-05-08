<template>
  <div class="q-pa-sm">
    <q-table
      :rows="inputOptions"
      :columns="fileredColumns"
      row-key="key"
      dense
      style="position: sticky; top: 0"
    >
      <!-- button at table header -->
      <template v-if="!readonly" v-slot:top>
        <q-btn color="primary" :label="$t('actions.add')" @click="onAddClick"></q-btn>
        <q-btn color="primary" :label="$t('actions.delete')"></q-btn>
        <q-space />
      </template>
      <!-- action buttons -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn dense round flat
            color="grey" icon="edit" @click="onEdit(props.row as CustomOption)"></q-btn>
          <q-btn dense round flat
            color="grey" icon="delete"></q-btn>
        </q-td>
      </template>
      <!-- languages -->
      <template v-slot:body-cell-languages="props">
        <q-td :props="props">
          <q-icon name="info"/>
          <q-tooltip>
            <div
              v-for="locale in availableLocales"
              :key="locale"
            >
              <div class="q-ma-sm">{{ locale }} - {{ props.row.languages[locale] }}</div>
            </div>
          </q-tooltip>
        </q-td>
      </template>
    </q-table>
  </div>
  <!-- dialog -->
  <q-dialog ref="dialogRef" v-model="prompt" persistent>
    <q-card style="min-width: 700px">
      <q-card-section>
        <div class="text-h6">File</div>
      </q-card-section>
      <!-- key input -->
      <q-card-section class="q-pt-none">
        <ValidationInput v-model="editedOption.key" :label="$t('key')"
          :inputValidator="customOptionValidateService.checkOptionKeyRules"
          :readonly="dialogMode === 2"
        />
      </q-card-section>
      <!-- value input -->
      <q-card-section class="q-pt-none">
        <ValidationInput v-model="editedOption.value" :label="$t('value')"
          :inputValidator="customOptionValidateService.checkOptionValueRules"
        />
      </q-card-section>
      <!-- languages input -->
      <q-card-section class="q-pt-none">
        <div
          v-for="locale in availableLocales"
          :key="locale"
        >
          <div class="q-ma-sm">{{ locale }}</div>
          <ValidationInput v-model="editedOption.languages[locale]"
            :inputValidator="languageValidateService.checkLanguageRules"
          />
        </div>
      </q-card-section>
      <!-- actions -->
      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" v-close-popup></q-btn>
        <q-btn flat label="Confirm" @click="onDialogConfirm"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { QDialog, QTableProps, useQuasar } from 'quasar';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ValidationInput from 'src/components/ValidationInput.vue';
import { availableLocales } from 'src/models/Locale';
import { DialogType } from 'src/models/DialogType';
import { customOptionValidateService } from '../services/CustomOptionValidateService';
import { languageValidateService } from '../services/LanguageValidateService';
import { CustomOption } from '../models/CustomAttribute';

const i18n = useI18n();

const $q = useQuasar();

const dialogRef = ref<QDialog>({} as QDialog);

const props = withDefaults(defineProps<{
  readonly: boolean,
  modelValue: CustomOption[],
}>(), {
  readonly: true,
});

type Emit = {
  (e: 'update:modelValue', value: CustomOption[]): void
}
const emit = defineEmits<Emit>();

const inputOptions = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const prompt = ref(false);

const editedOption = ref<CustomOption>({} as CustomOption);

const dialogMode = ref(DialogType.None);

const columns = computed(
  (): QTableProps['columns'] => [
    {
      name: 'actions', label: i18n.t('actions.action'), field: '', align: 'center', style: 'width: 60px',
    },
    {
      name: 'key', required: true, label: i18n.t('key'), align: 'left', field: 'key', sortable: true,
    },
    {
      name: 'value', label: i18n.t('value'), field: 'value', align: 'left', sortable: true,
    },
    {
      name: 'languages', label: i18n.t('language'), field: '', align: 'left', sortable: false,
    },
  ],
);

const fileredColumns = computed(
  (): QTableProps['columns'] => {
    if (props.readonly) {
      return columns.value?.filter((col) => col.name !== 'actions');
    }
    return columns.value;
  },
);

function onAddClick(): void {
  dialogMode.value = DialogType.Insert;
  editedOption.value = {
    key: '',
    value: '',
    languages: {},
  };
  prompt.value = true;
}

function onEdit(customOption: CustomOption): void {
  // Load custom option data into dialog
  dialogMode.value = DialogType.Edit;
  editedOption.value = JSON.parse(JSON.stringify(customOption));
  // Show dialog
  prompt.value = true;
}

function onDialogConfirm(): void {
  const error = customOptionValidateService.checkOptionRules(editedOption.value);
  if (error) {
    $q.notify({
      message: `Error: ${i18n.t(error)}`,
      color: 'red',
      icon: 'error',
    });
    return;
  }
  switch (dialogMode.value) {
    case DialogType.Edit: {
      const targetOption = inputOptions.value
        .find((option) => option.key === editedOption.value.key);
      if (!targetOption) {
        return;
      }
      targetOption.value = editedOption.value.value;
      targetOption.languages = editedOption.value.languages;
      break;
    }
    case DialogType.Insert: {
      inputOptions.value.push(editedOption.value);
      break;
    }
    default: {
      break;
    }
  }
  dialogRef.value.hide();
}
</script>

<style lang="sass" scoped>
.expandable
  font-family: 'Noto Sans TC'
</style>

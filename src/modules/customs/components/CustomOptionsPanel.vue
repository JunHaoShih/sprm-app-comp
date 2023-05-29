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
        <div class="q-gutter-xs">
          <q-btn
            push
            color="primary"
            :label="$t('actions.add')"
            @click="onAddClick"
          />
          <q-btn
            push
            color="primary"
            :label="$t('actions.delete')"
          />
          <q-space />
        </div>
      </template>
      <!-- action buttons -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense
            round
            flat
            color="grey"
            icon="edit"
            size="10px"
            @click="onEdit(props.row as CustomOption)"></q-btn>
          <q-btn
            dense
            round
            flat
            color="grey"
            icon="delete"
            size="10px"></q-btn>
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
  <q-dialog
    ref="dialogRef"
    v-model="prompt"
    persistent
  >
    <q-card style="min-width: 700px">
      <q-card-section class="bg-primary text-white row items-center" >
        <div class="text-h6">File</div>
        <q-space></q-space>
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <!-- key input -->
      <q-card-section class="q-pt-sm" >
        <ValidationInput
          v-model="editedOption.key"
          :label="$t('key')"
          :inputValidator="customOptionValidateService.checkOptionKeyRules"
          :readonly="dialogMode === 2"
        />
      </q-card-section>
      <!-- value input -->
      <q-card-section class="q-pt-none">
        <ValidationInput
          v-model="editedOption.value"
          :label="$t('value')"
          :inputValidator="customOptionValidateService.checkOptionValueRules"
        />
      </q-card-section>
      <!-- languages input -->
      <q-card-section class="q-pt-none">
        <div
          v-for="locale in availableLocales"
          :key="locale"
        >
          <ValidationInput
            v-model="editedOption.languages[locale]"
            :label="locale"
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
  availableLocales.forEach((locale) => {
    editedOption.value.languages[locale] = '';
  });
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
  const errors = customOptionValidateService.checkOptionRules(editedOption.value);
  if (errors.length > 0) {
    $q.notify({
      message: `Error: ${i18n.t(errors[0])}`,
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

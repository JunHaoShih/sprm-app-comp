<template>
  <PopupDialog
    v-model="prompt"
    :title="$t('parts.new')"
  >
    <template v-slot:center>
      <q-form
        ref="formRef"
        @submit="createAppUser"
      >
        <q-expansion-item
          v-model="infoExpanded"
          icon="article"
          :label="$t('info')"
          header-class="info-card-header"
          class="info-card-body"
          style="border-radius: 10px"
        >
        <div class="q-pa-sm">
          <ValidationInput
            v-model="createDto.username"
            :label="$t('users.username')"
            :inputValidator="appUserValidateService.usernameRules"
          />
          <ValidationInput
            v-model="createDto.password"
            type="password"
            :label="$t('users.password')"
            :inputValidator="appUserValidateService.passwordRules"
          />
          <ValidationInput
            v-model="createDto.fullName"
            :label="$t('users.fullName')"
            :inputValidator="appUserValidateService.fullNameRules"
          />
          <!-- is admin -->
          <div class="row">
            <q-checkbox
              left-label
              class="q-ml-sm"
              v-model="createDto.isAdmin"
              :label="$t('users.isAdmin')"
            />
          </div>
          <div class="column">
            <div class="q-mx-sm text-caption">{{ $t('remarks') }}</div>
            <q-input
              v-model="createDto.remarks"
              label="remarks" filled
              type="textarea"
            />
          </div>
        </div>
        </q-expansion-item>

        <q-separator class="q-mb-md"/>
        <CustomAttributesInputPanel
          v-model="createDto.customValues"
          :sprmObjectType="sprmObjectType"
        ></CustomAttributesInputPanel>
      </q-form>
    </template>
    <template v-slot:bottom>
      <q-btn flat :label="$t('actions.cancel')" v-close-popup></q-btn>
      <q-btn flat :label="$t('actions.confirm')" @click="submit"></q-btn>
    </template>
  </PopupDialog>
</template>

<script setup lang="ts">
import { QForm, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { SprmObjectType } from 'src/modules/objectTypes/models/ObjectType';
import { appUserValidateService } from 'src/modules/appUsers/services/AppUserValidateService';
import PopupDialog from 'src/components/PopupDialog.vue';
import ValidationInput from 'src/components/ValidationInput.vue';
import CustomAttributesInputPanel from 'src/components/CustomAttributesInputPanel.vue';
import { computed, ref } from 'vue';
import { CreateAppUserDto } from '../dtos/CreateAppUserDto';
import { appUserService } from '../services/AppUserService';
import { AppUser } from '../models/AppUser';

const sprmObjectType = SprmObjectType.AppUser;

const i18n = useI18n();

const $q = useQuasar();

const formRef = ref<QForm>({} as QForm);

const infoExpanded = ref(true);

const createDto = ref<CreateAppUserDto>({
  username: '',
  password: '',
  fullName: '',
  isAdmin: false,
  remarks: '',
  customValues: {},
});

type Props = {
  modelValue: boolean,
}
const props = defineProps<Props>();

type Emit = {
  (e: 'update:modelValue', value: boolean): void
  (e: 'onAppUserCreated', value: AppUser): void
}
const emit = defineEmits<Emit>();

const prompt = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function submit() {
  formRef.value?.submit();
}

async function createAppUser() {
  const newUser = await appUserService.create(createDto.value);
  if (newUser) {
    emit('onAppUserCreated', newUser);
    $q.notify({
      type: 'success',
      message: `${newUser.username} ${i18n.t('actions.inserts.success')}`,
    });
    prompt.value = false;
  }
}
</script>

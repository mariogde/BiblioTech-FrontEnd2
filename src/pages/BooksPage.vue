<template>
  <q-page class="bg-grey-2 q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div class="col-12 col-sm-5">
        <q-input
          v-model="searchTerm"
          placeholder="Buscar livro pelo título..."
          outlined
          dense
          bg-color="white"
          clearable
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <div class="q-mt-xs-sm q-mt-sm-none">
        <q-btn
          label="Novo Livro"
          color="dark"
          no-caps
          class="text-weight-bold"
          @click="openModal()"
        />
      </div>
    </div>

    <q-card flat class="border-radius-8">
      <q-table
        :rows="filteredBooks"
        :columns="columns"
        row-key="id"
        flat
        :loading="isLoading"
        no-data-label="Nenhum livro encontrado."
        :pagination="initialPagination"
        hide-bottom
      >
        <template #body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-xs text-right">
            <q-btn
              flat
              round
              dense
              icon="edit"
              color="grey-7"
              @click="openModal(props.row)"
            />
            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              @click="confirmDelete(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Modal Form (Cadastrar / Editar) -->
    <q-dialog v-model="isDialogOpen" persistent>
      <q-card style="width: 500px; max-width: 90vw;" class="q-pa-sm">
        <q-card-section>
          <div class="text-h6 text-weight-bold">
            {{ isEditing ? 'Editar Livro' : 'Cadastrar Livro' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveBook" class="q-gutter-md">
            <div>
              <div class="text-subtitle2 q-mb-xs">Título</div>
              <q-input
                v-model="form.title"
                outlined
                dense
                bg-color="grey-3"
                :rules="[val => !!val || 'O título é obrigatório']"
              />
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 q-mb-xs">Autor</div>
                <q-input
                  v-model="form.author"
                  outlined
                  dense
                  bg-color="grey-3"
                  :rules="[val => !!val || 'O autor é obrigatório']"
                />
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 q-mb-xs">Lançamento</div>
                <q-input
                  v-model="form.releaseDate"
                  type="date"
                  outlined
                  dense
                  bg-color="grey-3"
                  :rules="[val => !!val || 'A data é obrigatória']"
                />
              </div>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 q-mb-xs">Total</div>
                <q-input
                  v-model.number="form.totalQuantity"
                  type="number"
                  outlined
                  dense
                  bg-color="grey-3"
                  :rules="[val => val >= 0 || 'Mínimo de 0']"
                />
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 q-mb-xs">Em uso</div>
                <q-input
                  v-model.number="form.inUseQuantity"
                  type="number"
                  outlined
                  dense
                  bg-color="grey-3"
                  readonly
                />
              </div>
            </div>

            <div>
              <div class="text-subtitle2 q-mb-xs">Editora</div>
              <q-select
                v-model="form.publisherId"
                :options="publisherOptions"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                outlined
                dense
                bg-color="grey-3"
                :rules="[val => !!val || 'A editora é obrigatória']"
              />
            </div>

            <div class="row justify-center q-gutter-md q-mt-lg">
              <q-btn
                label="Cancelar"
                color="dark"
                no-caps
                v-close-popup
                style="width: 120px;"
              />
              <q-btn
                label="Confirmar"
                type="submit"
                color="positive"
                no-caps
                :loading="isSubmitting"
                style="width: 120px;"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar, type QTableColumn } from 'quasar'
import type { AxiosError } from 'axios'
import { api } from '../boot/axios'

interface PublisherOption {
  id: number
  name: string
}

interface Book {
  id: number
  title: string
  author: string
  releaseDate: string
  totalQuantity: number
  inUseQuantity: number
  publisher?: PublisherOption
}

interface ApiProblemDetail {
  detail?: string
  message?: string
}

const $q = useQuasar()
const books = ref<Book[]>([])
const publisherOptions = ref<PublisherOption[]>([])
const searchTerm = ref('')
const isLoading = ref(false)
const isSubmitting = ref(false)
const isDialogOpen = ref(false)
const isEditing = ref(false)


const initialPagination = ref({
  rowsPerPage: 0
})

const form = ref({
  id: null as number | null,
  title: '',
  author: '',
  releaseDate: '',
  totalQuantity: 1,
  inUseQuantity: 0,
  publisherId: null as number | null
})

const filteredBooks = computed(() => {
  if (!searchTerm.value.trim()) {
    return books.value
  }
  const query = searchTerm.value.toLowerCase()
  return books.value.filter(book =>
    book.title?.toLowerCase().includes(query)
  )
})

const columns: QTableColumn<Book>[] = [
  { name: 'title', label: 'Título', align: 'left', field: 'title', sortable: true },
  { name: 'author', label: 'Autor', align: 'left', field: 'author' },
  {
    name: 'releaseDate',
    label: 'Lançamento',
    align: 'left',
    field: (row) => (row.releaseDate ? row.releaseDate.substring(0, 4) : '')
  },
  { name: 'totalQuantity', label: 'Total', align: 'center', field: 'totalQuantity' },
  { name: 'inUseQuantity', label: 'Em uso', align: 'center', field: 'inUseQuantity' },
  {
    name: 'publisher',
    label: 'Editora',
    align: 'left',
    field: (row) => (row.publisher ? row.publisher.name : '-')
  },
  { name: 'actions', label: '', align: 'right', field: (row) => row }
]

const fetchBooks = async () => {
  isLoading.value = true
  try {
    const response = await api.get<Book[]>('/books')
    books.value = response.data
  } catch (err) {
    const error = err as AxiosError<ApiProblemDetail>
    const errorDetail = error.response?.data?.detail || error.response?.data?.message || 'Falha ao buscar livros.'
    $q.notify({ type: 'negative', message: errorDetail })
  } finally {
    isLoading.value = false
  }
}

const fetchPublishers = async () => {
  try {
    const response = await api.get<PublisherOption[]>('/publishers')
    publisherOptions.value = response.data
  } catch (err) {
    const error = err as AxiosError<ApiProblemDetail>
    const errorDetail = error.response?.data?.detail || 'Falha ao buscar editoras.'
    $q.notify({ type: 'negative', message: errorDetail })
  }
}

const openModal = (book: Book | null = null) => {
  if (book) {
    isEditing.value = true
    form.value = {
      id: book.id,
      title: book.title,
      author: book.author,
      releaseDate: book.releaseDate ? book.releaseDate.substring(0, 10) : '',
      totalQuantity: book.totalQuantity,
      inUseQuantity: book.inUseQuantity,
      publisherId: book.publisher ? book.publisher.id : null
    }
  } else {
    isEditing.value = false
    form.value = {
      id: null,
      title: '',
      author: '',
      releaseDate: '',
      totalQuantity: 1,
      inUseQuantity: 0,
      publisherId: null
    }
  }
  isDialogOpen.value = true
}

const saveBook = async () => {
  isSubmitting.value = true

  let formattedDate = form.value.releaseDate
  if (formattedDate && formattedDate.length === 4) {
    formattedDate = `${formattedDate}-01-01`
  }

  const payload = {
    title: form.value.title,
    author: form.value.author,
    releaseDate: formattedDate,
    totalQuantity: Number(form.value.totalQuantity),
    publisherId: Number(form.value.publisherId)
  }

  try {
    if (isEditing.value && form.value.id) {
      await api.put(`/books/${form.value.id}`, payload)
      $q.notify({ type: 'positive', message: 'Livro atualizado com sucesso!' })
    } else {
      await api.post('/books', payload)
      $q.notify({ type: 'positive', message: 'Livro cadastrado com sucesso!' })
    }
    isDialogOpen.value = false
    await fetchBooks()
  } catch (err) {
    const error = err as AxiosError<ApiProblemDetail>
    const errorDetail = error.response?.data?.detail || error.response?.data?.message || 'Erro ao salvar livro.'
    $q.notify({ type: 'negative', message: errorDetail })
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (book: Book) => {
  if (!book || !book.id) return

  $q.dialog({
    title: 'Excluir Livro',
    message: `Tem certeza que deseja excluir "${book.title}"?`,
    cancel: { label: 'Cancelar', flat: true },
    ok: { label: 'Excluir', color: 'negative' },
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        await api.delete(`/books/${book.id}`)
        $q.notify({ type: 'positive', message: 'Livro excluído com sucesso.' })
        await fetchBooks()
      } catch (err) {
        const error = err as AxiosError<ApiProblemDetail>
        const errorDetail =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          'Não foi possível excluir o livro. Verifique se ele possui aluguéis ativos.'
        $q.notify({ type: 'negative', message: errorDetail })
      }
    })()
  })
}

onMounted(() => {
  void fetchBooks()
  void fetchPublishers()
})
</script>

<style scoped>
.border-radius-8 {
  border-radius: 8px;
}
</style>
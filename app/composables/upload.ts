import { createError } from 'h3'
import type { FetchOptions } from 'ofetch'

interface UploadOptions extends FetchOptions {
  formKey?: string
  multiple?: boolean
}

export function useUpload(
  apiBase: string,
  options?: UploadOptions & { multiple: false }
): (data: FileList | HTMLInputElement | File[] | File) => Promise<R2Object>;
export function useUpload(
  apiBase: string,
  options?: UploadOptions
): ((data: File) => Promise<R2Object>) & ((data: FileList | HTMLInputElement | File[]) => Promise<R2Object[]>);
export function useUpload(apiBase: string, options: UploadOptions = {}) {
  const { formKey = "files", multiple = true, method, ...fetchOptions } = options || {};
  async function upload(data: File): Promise<R2Object>
  async function upload(data: FileList | HTMLInputElement | File[] | File): Promise<R2Object[] | R2Object> {
    let files: File[] = Array.isArray(data) ? data : [];
    if (String((data as HTMLInputElement)?.files).includes('FileList')) {
      files = Array.from((data as HTMLInputElement).files!);
    }
    if (data instanceof File) {
      files = [data];
    }
    if (typeof FileList !== "undefined" && data instanceof FileList) {
      files = Array.from(data);
    }
    if (!files || !(files as Array<File>).length) {
      throw createError({ statusCode: 400, message: "Missing files" });
    }

    const formData = new FormData();
    if (multiple) {
      for (const file of files) {
        formData.append(formKey, file);
      }
    } else {
      formData.append(formKey, files[0]!);
    }

    return $fetch(apiBase, {
      ...fetchOptions,
      method: (method || 'POST') as any,
      body: formData
    }).then(result => (multiple === false || data instanceof File) ? (result as any)[0] : result);
  }

  return upload;
}
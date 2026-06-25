import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ContractDto {
  id: string;
  fileName: string;
  status: string;
  language: string | null;
  uploadedAt: string;
}

export interface AnalysisDto {
  id: string;
  contractId: string;
  summary: string[];
  keyObligations: string[];
  risks: string[];
  redFlags: string[];
  questions: string[];
  language: string | null;
  createdAt: string;
}

export interface ContractDetailDto {
  contract: ContractDto;
  analysis: AnalysisDto | null;
}

export interface NoteDto {
  id: string;
  text: string;
  authorEmail: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ContractApiService {
  private readonly http = inject(HttpClient);

  upload(file: File, language?: string) {
    const form = new FormData();
    form.append('file', file, file.name);
    if (language) form.append('language', language);
    return this.http.post<ContractDto>('/api/contracts', form);
  }

  list() {
    return this.http.get<ContractDto[]>('/api/contracts');
  }

  /** Returns contract + stored analysis (null if not yet analysed). */
  getDetail(id: string) {
    return this.http.get<ContractDetailDto>(`/api/contracts/${id}`);
  }

  /** Triggers analysis; returns the five-section result. */
  analyzeContract(id: string, language?: string) {
    const body = language ? { language } : {};
    return this.http.post<AnalysisDto>(`/api/contracts/${id}/analyze`, body);
  }

  /** Uploads a newer version and returns the key differences. */
  compareVersions(id: string, file: File, language?: string) {
    const form = new FormData();
    form.append('file', file, file.name);
    if (language) form.append('language', language);
    return this.http.post<{ differences: string[] }>(`/api/contracts/${id}/compare`, form);
  }

  /** Lists all notes for a contract. */
  listNotes(contractId: string) {
    return this.http.get<NoteDto[]>(`/api/contracts/${contractId}/notes`);
  }

  /** Adds a note to a contract (Editor only). */
  addNote(contractId: string, text: string) {
    return this.http.post<NoteDto>(`/api/contracts/${contractId}/notes`, { text });
  }

  /** Downloads the analysis as PDF or Markdown blob. */
  exportAnalysis(contractId: string, format: 'pdf' | 'markdown') {
    return this.http.get(`/api/contracts/${contractId}/export`, {
      params: { format },
      responseType: 'blob',
      observe: 'response',
    });
  }
}

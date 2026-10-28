import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTicketResponse } from '../models/support.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupportService {
  constructor(private http: HttpClient) {}

  public createTicket(
    email: string,
    category: number | string,
    subject: string,
    description: string,
    screenshot?: File,
    baseUrl: string = environment.apiUrl
  ): Observable<CreateTicketResponse | null> {
    const formData = new FormData();
    formData.append('Email', email);
    formData.append('Category', category.toString());
    formData.append('Subject', subject);
    formData.append('Description', description);

    if (screenshot) {
      formData.append('Screenshot', screenshot, screenshot.name);
    }

    const fullUrl = `${baseUrl.replace(/\/$/, '')}/user/support/tickets`;
    return this.http.post<CreateTicketResponse>(fullUrl, formData);
  }
}

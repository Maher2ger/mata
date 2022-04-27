import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from 'rxjs';

import {SignupData, LoginData} from "./auth-data.model";
import {Router} from "@angular/router";

@Injectable({
	            providedIn: 'root'
            })
export class AuthService {
	private isAuthenticated = false;
	private token!: any;
	private authStatusListner = new Subject<boolean>();
	private tokenTimer!: NodeJS.Timer;
	userId!: string | null;

	constructor(private http: HttpClient, private router: Router) {
	}

	getToken(): string {
		return this.token;
	}

	getIsAuthenticated(): boolean {
		return this.isAuthenticated;
	}

	getAuthStatusList() {
		return this.authStatusListner.asObservable();
	}

	createUser(name: string, password: string, email: string) {
		const authData: SignupData = {
			name: name, email: email, password: password
		}
		this.http.post('http://localhost:3000/api/users/signup', authData)
		    .subscribe(() => {
			    this.router.navigate(['/login']);
		    }, error => {
			    this.router.navigate(['/signup']);
		    })
	}

	loginUser(email: string, password: string) {
		const authData: LoginData = {
			email: email, password: password
		}
		this.http
		    .post<{
			    message: string, token: string, expiresIn: number, userId: string
		    }>(`http://localhost:3000/api/users/login`, authData)
		    .subscribe(response => {
			    this.token = response.token;
			    if (response.token) {
				    this.userId = response.userId;
				    const expiresIn = response.expiresIn;
				    this.setAuthTimer(expiresIn);
				    this.isAuthenticated = true;
				    this.authStatusListner.next(true);
				    const now = new Date();
				    const expirationDate = new Date(now.getTime() + (expiresIn * 1000));
				    this.saveAuthData(response.token, expirationDate, this.userId);
				    this.router.navigate(['/']);
			    }
		    })
	}

	logoutUser() {
		this.token = null;
		this.isAuthenticated = false;
		this.authStatusListner.next(false);
		this.router.navigate(['/login']);
		clearTimeout(this.tokenTimer);
		this.clearAuthData();
		this.userId = null;
	}

	private saveAuthData(token: string, expiresIn: Date, userId: string) {
		localStorage.setItem('token', token);
		localStorage.setItem('userId', userId);
		localStorage.setItem('expirationDate', expiresIn.toISOString());

	}

	private clearAuthData() {
		localStorage.removeItem('token');
		localStorage.removeItem('expirationDate');
	}

	private getAuthData() {
		const token = localStorage.getItem('token');
		const expirationDate = localStorage.getItem('expirationDate');
		if (!token || !expirationDate) {
			return;
		} else {
			return {
				token         : token,
				expirationDate: new Date(expirationDate),
				userId        : localStorage.getItem('userId')
			}
		}
	}

	autoAuthUser() {
		const authInfos = this.getAuthData();
		if (!authInfos) {
			return;
		}
		let now = new Date();
		const expiresIn = authInfos.expirationDate.getTime();
		-now.getTime();
		if (expiresIn > 0) {
			this.token = authInfos.token;
			this.isAuthenticated = true;
			this.setAuthTimer(expiresIn * 1000);
			this.authStatusListner.next(true);
		}
		this.userId = authInfos.userId;
	}

	private setAuthTimer(duration: number) {
		this.tokenTimer = setTimeout(() => {
			this.logoutUser();
		}, duration * 1000)
	}

	getUserId() {
		return this.userId;
	}
}

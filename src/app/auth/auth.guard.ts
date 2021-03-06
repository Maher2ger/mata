import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService,
	            private router: Router) {

	}
	canActivate(route: ActivatedRouteSnapshot,
	            state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		this.authService.autoAuthUser();
		const isAuthenticated = this.authService.getIsAuthenticated();
		console.log(isAuthenticated);
		if (!isAuthenticated) {
		  this.router.navigate(['/login']);
		}
		return true;
	}

}

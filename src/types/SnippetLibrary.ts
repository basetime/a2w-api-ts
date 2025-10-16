/**
 * Entity for the snippetLibraries collection.
 */
export interface SnippetLibrary {
  /**
   * The snippet library ID.
   */
  id: string;

  /**
   * The name of the snippet library.
   */
  name: string;

  /**
   * The description of the snippet library.
   */
  description: string;

  /**
   * The value of the snippet library.
   */
  code: string;

  /**
   * The packages to install.
   *
   * This is a list of NPM package names in the form of `package-name@version`.
   */
  packages: string[];

  /**
   * The organization that owns the snippet library.
   */
  organization: string;
}

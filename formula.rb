class Sepack < Formula
	desc "Command-line interface for build android project base on MVVM"
	homepage "https://github.com/utsmannn/android-sepack"
	url "https://github.com/utsmannn/android-sepack/archive/0.1.2.tar.gz"
	sha256 "7b4e3505e1e6e5e6d882527c32e4ec4db3b2ff7a37102f49599c79509d2b2a98"
	head "https://github.com/utsmannn/android-sepack.git"
	version "0.1.2"

	def install
		bin.install "sepack"
	end

	test do
		system "#{bin}/android-sepack"
	end
end